import { InvalidEntityError } from '../../../../../web-api/src/errors/errors';
import { isEmpty } from 'lodash';
import joi from 'joi';

const setIsValidated = obj => {
  Object.defineProperty(obj, 'isValidated', {
    enumerable: false,
    value: true,
    writable: false,
  });
};

function toRawObject(entity) {
  const keys = Object.keys(entity);
  const obj = {};
  for (let key of keys) {
    const value = entity[key];
    if (Array.isArray(value)) {
      obj[key] = value.map(v => {
        if (typeof v === 'string' || v instanceof String) {
          return v;
        } else {
          return toRawObject(v);
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      obj[key] = toRawObject(value);
    } else {
      obj[key] = value;
    }
  }
  if (entity.isValidated) {
    setIsValidated(obj);
  }
  return obj;
}

export abstract class JoiValidationEntity_New {
  public entityName: string;

  constructor(entityName: string) {
    this.entityName = entityName;
  }

  abstract getValidationRules(): any;

  getValidationErrors(): Record<string, string> | null {
    const rules = this.getValidationRules();
    const schema = rules.validate ? rules : joi.object().keys(rules);
    const { error } = schema.validate(this, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (!error) return null;

    let errors = {};
    error.details.forEach(detail => {
      if (!Number.isInteger(detail.context.key)) {
        errors[detail.context.key || detail.type] = detail.message;
      } else {
        errors[detail.context.label] = detail.message;
      }
    });

    return errors;
  }

  isValid() {
    const validationErrors = this.getValidationErrors();
    return isEmpty(validationErrors);
  }

  validate(options?: {
    applicationContext: IApplicationContext;
    logErrors: boolean;
  }) {
    const applicationContext = options?.applicationContext;
    const logErrors = options?.logErrors;

    if (!this.isValid()) {
      const stringifyTransform = obj => {
        if (!obj) return obj;
        const transformed = {};
        Object.keys(obj).forEach(key => {
          if (typeof obj[key] === 'string') {
            transformed[key] = obj[key].replace(/"/g, "'");
          } else {
            transformed[key] = obj[key];
          }
        });
        return transformed;
      };

      if (logErrors) {
        applicationContext?.logger.error('*** Entity with error: ***', this);
      }

      const validationErrors = this.getValidationErrors()!;

      throw new InvalidEntityError(
        this.entityName,
        JSON.stringify(stringifyTransform(validationErrors)),
        validationErrors,
      );
    }

    setIsValidated(this);

    return this;
  }

  validateForMigration() {
    const rules = this.getValidationRules();
    const schema = rules.validate ? rules : joi.object().keys(rules);
    let { error } = schema.validate(this, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      console.log('Error, entity is invalid: ', this);

      throw new InvalidEntityError(
        this.entityName,
        JSON.stringify(
          error.details.map(detail => {
            return detail.message.replace(/"/g, "'");
          }),
        ),
      );
    }

    setIsValidated(this);

    return this;
  }

  toRawObject() {
    return toRawObject(this) as ExcludeMethods<this>;
  }

  static validateRawCollection<T extends JoiValidationEntity_New>(
    this: new (someVar: any, someArgs: any) => T,
    collection: any[] = [],
    args: any,
  ) {
    return collection.map(
      rawEntity =>
        new this(rawEntity, args).validate().toRawObject() as ExcludeMethods<T>,
    );
  }
}
