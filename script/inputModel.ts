import { Validation, ValidationPayload } from '@/api/validation.ts';
import { SelectOption } from '@/types';

export type InputModelOptions = {
    validationName?: string;
    nullable?: boolean;
    numeric?: boolean;
    boolean?: boolean;
    validations?: Array<
        typeof Validation | [typeof Validation, ValidationPayload]
    >;
};

export class InputModel<T> {
    public name: string;
    public isRepeater: false;
    public ogVal?: T | null;
    public val?: T | null;
    public errors: string[];
    public validations: Validation[] = [];
    public _validationName: string;
    public _nullable: boolean;
    public _numeric: boolean;

    constructor(
        name: string,
        val?: T | null,
        options: InputModelOptions = { nullable: false },
    ) {
        this.name = name;
        this.isRepeater = false;
        this.ogVal = val;
        this.val = val;
        this.errors = [];

        //Options
        this._nullable = options.nullable || false;
        this._validationName = options.validationName || '';
        this._numeric = options.numeric || false;

        // Validations
        if (options.validations) {
            options.validations.forEach((validation) => {
                this.addValidation(validation);
            });
        }
    }

    get validationName(): string {
        return this._validationName || this.name;
    }

    get isValid() {
        return this.errors.length === 0;
    }

    get multiFieldValue(): string[] {
        if (this.val === null || this.val === undefined) {
            return [];
        }

        if (Array.isArray(this.val)) {
            return this.val.map(String);
        }

        return [String(this.val)];
    }

    set multiFieldValue(val: string[]) {
        if (this._nullable && val.length === 0) {
            this.val = null;
            return;
        }

        if (Array.isArray(this.val)) {
            if (this._numeric) {
                this.val = val.map(Number) as T;
                return;
            }
            this.val = val as unknown as T;
            return;
        }

        this.val = val.join() as unknown as T;
    }

    get fieldValue(): string {
        if (this.val === null || this.val === undefined) {
            return '';
        }

        return String(this.val);
    }

    set fieldValue(val: T) {
        if (this._nullable && val === '') {
            this.val = null;
            return;
        }

        if (this._numeric) {
            this.val = Number(val) as T;
            return;
        }

        this.val = val;
    }

    pushValidation(validation: Validation) {
        this.validations.push(validation);
        return this;
    }

    addValidation(
        validation: typeof Validation | [typeof Validation, ValidationPayload],
    ) {
        if (Array.isArray(validation)) {
            return this.pushValidation(
                new validation[0](this.validationName, validation[1]),
            );
        }

        return this.pushValidation(new validation(this.validationName));
    }

    validate() {
        this.clearErrors();
        this.validations.forEach((validation) => {
            validation.validate(this);
        });

        return this.isValid;
    }

    hasValidation(validation: typeof Validation) {
        for (const curValidation of this.validations) {
            if (curValidation.constructor.name === validation.name) {
                return true;
            }
        }

        return false;
    }

    setErrors(errors: string[]) {
        this.errors = errors;
    }

    setNewVal(val: T | null) {
        this.ogVal = val;
        this.val = val;
    }

    get isChanged() {
        return JSON.stringify(this.ogVal) !== JSON.stringify(this.val);
    }

    get hasErrors() {
        return this.errors.length > 0;
    }

    addError(error: string) {
        this.errors.push(error);
    }

    clearErrors() {
        this.errors = [];
    }
}

export type BoolInputModel = InputModel<boolean>;
export type TextInputModel = InputModel<string>;
export type CheckboxInputModel = InputModel<string[]>;
export type NumberInputModel = InputModel<number>;
export type SearchInputModel<T = string> = InputModel<SelectOption<T>>;
