import { InputModel } from './inputModel';

export type RepeaterStateOptions = {
    nullable: boolean;
};

export class RepeaterState<
    T extends Record<string, any>,
    S extends Record<string, InputModel<any>>,
> {
    public generator;
    public values: T[] | null;
    public generatedState: S[];
    public name: string;
    public isRepeater: true;
    public options: RepeaterStateOptions;

    constructor(
        name: string,
        values: T[] | null,
        generatorFunction: (values: T | null) => S,
        options: RepeaterStateOptions = { nullable: false },
    ) {
        this.name = name;
        this.options = options;
        this.isRepeater = true;
        this.generator = generatorFunction;
        this.values = values || null;
        this.generatedState = this.generateState(this.values);
    }

    public generateState(values: T[] | null) {
        if (!this.options.nullable && (!values || values.length === 0)) {
            return [this.generator(null)];
        }

        if (!values) {
            return [];
        }

        return values.map((curVal) => this.generator(curVal));
    }

    public addRow() {
        this.generatedState = [...this.generatedState, this.generator(null)];
    }

    public deleteRow(index: number) {
        const newState = [...this.generatedState];
        newState.splice(index, 1);

        // If we removed the last row, add an empty one
        if (!this.options.nullable && newState.length === 0) {
            newState.push(this.generator(null));
        }

        this.generatedState = newState;
    }

    set state(values: T[] | null) {
        this.generatedState = this.generateState(values);
    }

    get state(): S[] {
        return this.generatedState;
    }

    get hasErrors() {
        for (const stateItem of this.generatedState) {
            // Check each field in the row for errors
            for (const field of Object.values(stateItem)) {
                if (field && 'hasErrors' in field && field.hasErrors) {
                    return true;
                }
            }
        }

        return false;
    }

    get isChanged() {
        if (!this.values && this.generatedState.length > 0) {
            return true;
        }

        if (this.values?.length !== this.generatedState.length) {
            return true;
        }

        for (let i = 0; i < this.generatedState.length; i++) {
            const stateItem = this.generatedState[i];
            // Check each field in the row for changes
            for (const field of Object.values(stateItem)) {
                if (field && 'isChanged' in field && field.isChanged) {
                    return true;
                }
            }
        }

        return false;
    }

    get val() {
        if (this.options.nullable && this.generateState.length === 0) {
            return null;
        }

        return this.generatedState.map((stateItem) => {
            const stateItemVal = {} as Record<keyof S, any>;

            const keys = Object.keys as <X extends object>(
                item: X,
            ) => Array<keyof X>;

            keys(stateItem).forEach((key) => {
                let val = stateItem[key].val;

                // Handles SelectOption
                if (val && val.constructor === Object && 'val' in val) {
                    val = val.val;
                }

                stateItemVal[key] = val;
            });

            return stateItemVal;
        });
    }

    setErrors(errors: Record<string, string[]>) {
        Object.entries(errors).forEach(([key, curErrors]) => {
            if (!key.startsWith(this.name)) {
                return;
            }

            const parts = key.split('.');
            if (parts.length !== 3) {
                return;
            }

            const [, rowIndex, fieldName] = parts;
            const index = parseInt(rowIndex);

            if (index >= this.generatedState.length) {
                return;
            }

            const row = this.generatedState[index];
            const field = row[fieldName as keyof typeof row];

            if (field) {
                field.setErrors(curErrors);
            }
        });
    }

    validate() {
        this.clearErrors();

        this.generatedState.forEach((row) => {
            Object.values(row).forEach((field) => {
                if ('validate' in field) {
                    field.validate();
                }
            });
        });

        return !this.hasErrors;
    }

    clearErrors() {
        this.generatedState.forEach((row) => {
            Object.values(row).forEach((field) => {
                if ('clearErrors' in field) {
                    field.clearErrors();
                }
            });
        });
    }
}
