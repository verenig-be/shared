import { InputModel } from '@/api/inputModel.ts';

export type ValidationPayload = Record<string, any>;
export type EmptyPayload = { message?: string };

export class Validation {
    public readonly name: string;
    public messageString: string = '{{name}} is not valid';
    public payload?: ValidationPayload;

    constructor(name: string, payload?: ValidationPayload) {
        this.name = name;
        if (payload?.message) {
            this.messageString = payload.message;
        }
        this.payload = payload;
    }

    get message() {
        return this.messageString.replaceAll('{{name}}', this.name);
    }

    set message(val: string) {
        this.messageString = val;
    }

    validate(inputModel: InputModel<any>) {
        if (!this.logic(inputModel.val)) {
            inputModel.addError(this.message);
            return false;
        }

        return true;
    }

    logic(val: any): boolean {
        // implement this
        return !!val;
    }
}

export class Required extends Validation {
    // keywords: {{name}}
    public messageString: string = '{{name}} is required';

    constructor(name: string, payload?: EmptyPayload) {
        super(name, payload);
    }

    logic(val: any): boolean {
        if (val === '<p></p>') {
            return false;
        }

        if (val === 0) {
            return false;
        }

        return !!val;
    }
}

export class Email extends Validation {
    // keywords: {{name}}
    public messageString: string = '{{name}} is not a valid email-address';

    constructor(name: string, payload?: EmptyPayload) {
        super(name, payload);
    }

    logic(val: any): boolean {
        if (!val) {
            return true;
        }

        const emailRegex =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return val.match(emailRegex);
    }
}

export class LowerThan extends Validation {
    messageString: string = '{{name}} should be lower than {{max}}';
    max: number;

    constructor(name: string, payload: { message?: string; max: number }) {
        super(name, payload);
        this.max = payload.max;
    }

    get message() {
        return this.messageString
            .replaceAll('{{name}}', this.name)
            .replaceAll('{{max}}', String(this.max));
    }

    logic(val: any): boolean {
        const numVal = Number(val);
        if (Number.isNaN(numVal) || !this.payload) {
            return false;
        }

        return val < this.max;
    }
}

export class HigherThan extends Validation {
    messageString: string = '{{name}} should be higher than {{min}}';
    min: number;

    constructor(name: string, payload: { message?: string; min: number }) {
        super(name, payload);
        this.min = payload.min;
    }

    get message() {
        return this.messageString
            .replaceAll('{{name}}', this.name)
            .replaceAll('{{min}}', String(this.min));
    }

    logic(val: any): boolean {
        const numVal = Number(val);
        if (Number.isNaN(numVal) || !this.payload) {
            return false;
        }

        return val > this.min;
    }
}

export class Between extends Validation {
    // keywords: {{name}} {{min}} {{max}}
    messageString: string = '{{name}} should be between {{min}} and {{max}}';
    min: number;
    max: number;

    constructor(
        name: string,
        payload: {
            message?: string;
            min: number;
            max: number;
        },
    ) {
        super(name, payload);
        this.min = payload.min;
        this.max = payload.max;
    }

    get message() {
        return this.messageString
            .replaceAll('{{name}}', this.name)
            .replaceAll('{{max}}', String(this.max))
            .replaceAll('{{min}}', String(this.min));
    }

    logic(val: any): boolean {
        const numVal = Number(val);
        if (Number.isNaN(numVal) || !this.payload) {
            return false;
        }

        return val <= this.max && val >= this.min;
    }
}

export class LengthIs extends Validation {
    //keywords {{name}} {{strLength}}
    messageString: string = '{{name}} should be {{strLength}} characters long';
    strLength: number;

    constructor(
        name: string,
        payload: {
            message?: string;
            strLength: number;
        },
    ) {
        super(name, payload);
        this.strLength = payload.strLength;
    }

    get message() {
        return this.messageString
            .replaceAll('{{name}}', this.name)
            .replaceAll('{{strLength}}', String(this.strLength));
    }

    logic(val: any): boolean {
        if (!Number.isInteger(val?.length)) {
            return true;
        }

        return val.length === this.strLength;
    }
}

export class LengthMax extends Validation {
    // keywords {{name}} {{maxLength}}
    messageString: string =
        '{{name}} is longer than {{maxLength}} characters long';
    maxLength: number;

    constructor(
        name: string,
        payload: {
            message?: string;
            maxLength: number;
        },
    ) {
        super(name, payload);
        this.maxLength = payload.maxLength;
    }

    get message() {
        return this.messageString
            .replaceAll('{{name}}', this.name)
            .replaceAll('{{maxLength}}', String(this.maxLength));
    }

    logic(val: any): boolean {
        if (!Number.isInteger(val?.length)) {
            return true;
        }

        return val.length <= this.maxLength;
    }
}

export class LengthBetween extends Validation {
    //keywords {{name}} {{min}} {{max}}
    messageString: string =
        '{{name}} should be between {{min}} and {{max}} characters long';
    min: number;
    max: number;

    constructor(
        name: string,
        payload: {
            message?: string;
            min: number;
            max: number;
        },
    ) {
        super(name, payload);
        this.min = payload.min;
        this.max = payload.max;
    }

    get message() {
        return this.messageString
            .replaceAll('{{name}}', this.name)
            .replaceAll('{{max}}', String(this.max))
            .replaceAll('{{min}}', String(this.min));
    }

    logic(val: any): boolean {
        if (!Number.isInteger(val?.length)) {
            return true;
        }

        return val.length <= this.max && val >= this.min;
    }
}
