/* eslint-disable @typescript-eslint/no-unused-vars */
import { InvalidEntityError } from '../../../../web-api/src/errors/errors';
import {
  JoiErrorDetail,
  getFormattedValidationErrors_NEW,
} from './joiValidationEntity/JoiValidationEntity.new.getFormattedValidationErrors';
import { differenceWith, fromPairs, isEmpty, isEqual, toPairs } from 'lodash';
import joi from 'joi';

const setIsValidated = obj => {
  Object.defineProperty(obj, 'isValidated', {
    enumerable: false,
    value: true,
    writable: false,
  });
};

/**
 * converts an entity to the raw json object form needed for persistence.
 *
 * @returns {object} the raw object
 */
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

/**
 * returns all of the validation errors after being converted to their formatted output
 *
 * @returns {object} the formatted errors
 */
function getFormattedValidationErrorsHelper(entity: JoiValidationEntity) {
  const errors = entity.getValidationErrors();
  if (!errors) return null;
  for (let key of Object.keys(errors)) {
    const errorMap = entity.getErrorToMessageMap()[key];
    if (Array.isArray(errorMap)) {
      for (let errorObject of errorMap) {
        if (
          typeof errorObject === 'object' &&
          errors[key].includes(errorObject.contains)
        ) {
          errors[key] = errorObject.message;
          break;
        } else if (typeof errorObject !== 'object') {
          errors[key] = errorObject;
          break;
        }
      }
    } else if (errorMap) {
      errors[key] = errorMap;
    }
  }
  return errors;
}

function getFormattedValidationErrors(entity): Record<string, string> | null {
  const keys = Object.keys(entity);
  const obj = {};
  let errors: {} | null = null;
  if (entity.getFormattedValidationErrors) {
    errors = getFormattedValidationErrorsHelper(entity);
  }
  if (errors) {
    for (const key of Object.keys(errors)) {
      if (
        // remove unhelpful error messages from contact validations
        typeof errors[key] == 'string' &&
        errors[key].endsWith('does not match any of the allowed types')
      ) {
        delete errors[key];
      }
    }
    Object.assign(obj, errors);
  }
  for (let key of keys) {
    const value = entity[key];
    if (errors && errors[key]) {
      continue;
    } else if (Array.isArray(value)) {
      obj[key] = value
        .map((v, index) => {
          const e = getFormattedValidationErrors(v);
          return e ? { ...e, index } : null;
        })
        .filter(v => v);
      if (obj[key].length === 0) {
        delete obj[key];
      }
    } else if (
      typeof value === 'object' &&
      value &&
      value.getFormattedValidationErrors
    ) {
      obj[key] = getFormattedValidationErrors(value);
      if (!obj[key]) delete obj[key];
    }
  }
  const results = Object.keys(obj).length === 0 ? null : obj;
  // TODO: revert these after manual testing in test is complete
  const newResults = getFormattedValidationErrors_NEW(entity);

  /* eslint-disable no-restricted-globals */
  const inFrontEnd = typeof document !== 'undefined';

  if (inFrontEnd && customStringify(results) !== customStringify(newResults)) {
    const newResultsDiff = differenceWith(
      toPairs(newResults!),
      toPairs(results!),
      isEqual,
    );

    const resultsDiff = differenceWith(
      toPairs(results!),
      toPairs(newResults!),
      isEqual,
    );

    const thisURL = new URL(document.URL);
    const errorMessage = `Validation message mismatch. Please take a screenshot of this message and add to Devex Card 1187. 
    Page: ${thisURL.pathname}
    Entity Name: ${entity.entityName}
    Old Results: ${JSON.stringify(fromPairs(resultsDiff))}
    New Results: ${JSON.stringify(fromPairs(newResultsDiff))}`;
    alert(errorMessage);
  }

  return results;
}

function customStringify(obj) {
  if (!obj) return null;
  const keys = Object.keys(obj).sort();
  const result: string[] = [];

  for (const key of keys) {
    const value = obj[key];
    result.push(`"${key}": ${JSON.stringify(value)}`);
  }
  return `{\n\t${result.join(',\n\t')}\n}`;
}

export abstract class JoiValidationEntity {
  public entityName: string;

  constructor(entityName: string) {
    this.entityName = entityName;
  }

  abstract getValidationRules(): any;
  abstract getErrorToMessageMap(): any;

  abstract getValidationRules_NEW(): any;

  getValidationErrors() {
    const rules = this.getValidationRules();
    const schema = rules.validate ? rules : joi.object().keys(rules);
    const { error } = schema.validate(this, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (!error) return null;
    const errors = {};
    error.details.forEach(detail => {
      if (!Number.isInteger(detail.context.key)) {
        errors[detail.context.key || detail.type] = detail.message;
      } else {
        errors[detail.context.label] = detail.message;
      }
    });
    return errors;
  }

  getValidationErrors_NEW(): { details: JoiErrorDetail[] } | null {
    try {
      const rules = this.getValidationRules_NEW();
      const schema = rules.validate ? rules : joi.object().keys(rules);
      const { error } = schema.validate(this, {
        abortEarly: false,
        allowUnknown: true,
      });
      if (!error) return null;
      return error;
    } catch (e) {
      console.log('THIS IS THE ENTITY ', this.entityName);
      return null;
    }
  }

  isValid() {
    const validationErrors = this.getFormattedValidationErrors();
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

  getFormattedValidationErrors() {
    return getFormattedValidationErrors(this);
  }

  getFormattedValidationErrors_NEW() {
    return getFormattedValidationErrors_NEW(this);
  }

  toRawObject() {
    return toRawObject(this) as ExcludeMethods<this>;
  }

  toRawObjectFromJoi() {
    return toRawObject(this) as ExcludeMethods<this>;
  }

  validateForMigration() {
    const rules = this.getValidationRules();
    const schema = rules.validate ? rules : joi.object().keys(rules);
    let { error } = schema.validate(this, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
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

  validateWithLogging(applicationContext) {
    return this.validate({ applicationContext, logErrors: true });
  }

  static validateRawCollection<T extends JoiValidationEntity>(
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
