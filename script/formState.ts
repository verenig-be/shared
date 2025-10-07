import { InputModel } from './inputModel.ts';
import { RepeaterState } from './repeaterState.ts';

type StateValues = InputModel<any> | RepeaterState<any, any>;

export class FormState<T extends Record<string, StateValues>> {
    public id;
    public state;

    constructor(state: T, id: number | null = null) {
        this.state = state;
        this.id = id;
    }

    get keys() {
        return Object.keys(this.state) as Array<keyof T>;
    }

    get values() {
        return Object.values(this.state);
    }

    get isCreate() {
        return this.id === null;
    }

    get isEdit() {
        return this.id !== null;
    }

    get hasErrors() {
        return (
            this.values.filter((inputModel) => inputModel.hasErrors).length > 0
        );
    }

    get hasChanges() {
        return (
            this.values.filter((inputModel) => inputModel.isChanged).length > 0
        );
    }

    get isValid() {
        return (
            this.values.filter((inputModel) => inputModel.hasErrors).length ===
            0
        );
    }

    setErrors(errors: Record<string, string[]>) {
        this.values.forEach((inputModel) => {
            const key = inputModel.name;

            if (inputModel.isRepeater) {
                return inputModel.setErrors(errors);
            }

            if (key in errors) {
                inputModel.setErrors(errors[key]);
            }
        });
    }

    validate() {
        this.values.forEach((inputModel) => {
            inputModel.validate();
        });

        return this.isValid;
    }

    clearErrors() {
        this.values.forEach((inputModel) => {
            inputModel.clearErrors();
        });
    }

    /**
     * Get een object of the changed values, ready for patching
     * Resource type is not typesafe be careful!!
     * @param defaultModel optionally define default values
     */
    getChangedModelData<Resource extends Record<string, any>>(
        defaultModel: Partial<Resource> = {},
    ): Partial<Resource> {
        const model = defaultModel as Partial<Resource>;

        if (this.isEdit) {
            model['id' as keyof Resource] = this.id as any;
        }

        this.keys.forEach((key) => {
            if (!this.state[key].isChanged) {
                return;
            }
            const rKey = key as keyof Resource;
            let val = this.state[key].val;

            // Handles SelectOption
            if (val && val.constructor === Object && 'val' in val) {
                val = val.val;
            }

            model[rKey] = val;
        });

        return model;
    }

    getModelData<Resource extends Record<string, any>>(
        defaultModel: Partial<Resource> = {},
    ): Resource {
        const model = defaultModel as Resource;

        if (this.isEdit) {
            model['id' as keyof Resource] = this.id as any;
        }

        this.keys.forEach((key) => {
            const lKey = key as keyof Resource;
            let val = this.state[key].val;

            if (val === null || val === undefined) {
                return;
            }

            // Handles SelectOption
            if (val && val.constructor === Object && 'val' in val) {
                val = val.val;
            }

            model[lKey] = val;
        });

        return model;
    }
}
