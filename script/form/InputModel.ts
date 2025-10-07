import type { Validation } from './validation';

export type BaseInputModelOptions = {
  errors?: string[];
  validations?: Validation[];
  validationName?: string;
};

export type NumberInputModelOptions = BaseInputModelOptions & {
  fallback?: number;
};

export class BaseInputModel<T = any> {
  public name: string;
  public ogVal: T;
  public val: T;
  public errors: string[] = [];
  public validations: Validation[] = [];
  public validationName: string;

  constructor(name: string, val: T, options: BaseInputModelOptions = {}) {
    this.name = name;
    this.val = val;
    this.ogVal = val;

    if (options.errors) {
      this.errors = options.errors;
    }

    if (options.validations) {
      this.validations = options.validations;
    }

    this.validationName = options.validationName || name;
  }

  get fieldValue(): string {
    return String(this.val);
  }

  set fieldValue(val: T) {
    this.val = val;
  }

  pushValidation(validation: Validation) {
    this.validations.push(validation);
    return this;
  }
}

export class TextInputModel extends BaseInputModel<string> {
  constructor(name: string, val: string, options: BaseInputModelOptions = {}) {
    super(name, val, options);
  }
}

export class NullableTextInputModel extends BaseInputModel<string | null> {
  constructor(
    name: string,
    val: string | null,
    options: BaseInputModelOptions = {},
  ) {
    super(name, val, options);
  }

  override set fieldValue(val: string) {
    if (val === '') {
      this.val = null;
    }

    this.val = val;
  }
}

export class NumberInputModel extends BaseInputModel<number> {
  private fallback: number = 0;

  constructor(
    name: string,
    val: number,
    options: NumberInputModelOptions = {},
  ) {
    super(name, val, options);

    if (options.fallback !== undefined) {
      this.fallback = options.fallback;
    }
  }

  override set fieldValue(val: string) {
    const numVal = Number(val);

    if (isNaN(numVal)) {
      this.val = this.fallback;
      return;
    }

    this.val = numVal;
  }
}

export class NullableNumberInputModel extends BaseInputModel<number | null> {
  private fallback: number | null = null;
  constructor(
    name: string,
    val: number | null,
    options: NumberInputModelOptions = {},
  ) {
    super(name, val, options);

    if (options.fallback !== undefined) {
      this.fallback = options.fallback;
    }
  }

  override set fieldValue(val: string) {
    if (val === '') {
      this.val = null;
    }

    const numVal = Number(val);

    if (isNaN(numVal)) {
      this.val = this.fallback;
      return;
    }

    this.val = Number(val);
  }
}
