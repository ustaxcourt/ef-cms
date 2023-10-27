/* eslint-disable @typescript-eslint/no-unused-vars */
import { InvalidEntityError } from '../../../../web-api/src/errors/errors';
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

  validate() {
    const { error } = this.getValidationRules().validate(this, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (!error) return null;

    let errors = {};
    error!.details.forEach(detail => {
      if (!Number.isInteger(detail.context?.key)) {
        errors[detail.context?.key || detail.type] = detail.message;
      } else {
        errors[detail.context?.label] = detail.message;
      }
    });

    return errors;
  }

  validateWithLogging(applicationContext) {
    return this.validate({ applicationContext, logErrors: true });
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

const joiErrorKeys = [
  'any.type',
  'any.allow',
  'any.alter',
  'any.artifact',
  'any.cache',
  'any.cast',
  'any.concat',
  'any.custom',
  'any.default',
  'any.describe',
  'any.description',
  'any.empty',
  'any.error',
  'any.example',
  'any.external',
  'any.extract',
  'any.failover',
  'any.forbidden',
  'any.fork',
  'any.id',
  'any.invalid',
  'any.keep',
  'any.label',
  'any.message',
  'any.messages',
  'any.meta',
  'any.note',
  'any.only',
  'any.optional',
  'any.prefs',
  'any.presence',
  'any.raw',
  'any.required',
  'any.result',
  'any.rule',
  'any.ruleset',
  'any.shared',
  'any.strict',
  'any.strip',
  'any.tag',
  'any.tailor',
  'any.unit',
  'any.valid',
  'any.validate',
  'any.validateAsync',
  'any.warn',
  'any.warning',
  'any.when',
  'alternatives.conditional',
  'alternatives.match',
  'alternatives.try',
  'array.has',
  'array.items',
  'array.length',
  'array.max',
  'array.min',
  'array.ordered',
  'array.single',
  'array.sort',
  'array.sparse',
  'array.unique',
  'binary.encoding',
  'binary.length',
  'binary.max',
  'binary.min',
  'boolean.falsy',
  'boolean.sensitive',
  'boolean.truthy',
  'date.greater',
  'date.iso',
  'date.less',
  'date.max',
  'date.min',
  'date.timestamp',
  'function.arity',
  'link.ref',
  'link.concat',
  'number.greater',
  'number.integer',
  'number.less',
  'number.max',
  'number.min',
  'number.multiple',
  'number.negative',
  'number.port',
  'number.positive',
  'number.precision',
  'number.sign',
  'number.unsafe',
  'object.and',
  'object.append',
  'object.assert',
  'object.instance',
  'object.keys',
  'object.length',
  'object.max',
  'object.min',
  'object.nand',
  'object.or',
  'object.oxor',
  'object.pattern',
  'object.ref',
  'object.regex',
  'object.rename',
  'object.schema',
  'object.unknown',
  'object.with',
  'object.without',
  'object.xor',
  'string.alphanum',
  'string.base64',
  'string.case',
  'string.creditCard',
  'string.dataUri',
  'string.domain',
  'string.email',
  'string.guid',
  'string.hex',
  'string.hostname',
  'string.insensitive',
  'string.ip',
  'string.isoDate',
  'string.isoDuration',
  'string.length',
  'string.lowercase',
  'string.max',
  'string.min',
  'string.normalize',
  'string.pattern',
  'string.pattern.base',
  'string.replace',
  'string.token',
  'string.trim',
  'string.truncate',
  'string.uppercase',
  'string.uri',
  'symbol.map',
  'alternatives.all',
  'alternatives.any',
  'alternatives.one',
  'alternatives.types',
  'any.ref',
  'any.unknown',
  'array.base',
  'array.excludes',
  'array.includesRequiredBoth',
  'array.includesRequiredKnowns',
  'array.includesRequiredUnknowns',
  'array.includes',
  'array.orderedLength',
  'array.hasKnown',
  'array.hasUnknown',
  'binary.base',
  'boolean.base',
  'date.base',
  'date.format',
  'date.strict',
  'function.class',
  'function.maxArity',
  'function.minArity',
  'number.base',
  'number.infinity',
  'object.base',
  'object.missing',
  'object.refType',
  'string.base',
  'string.empty',
  'string.hexAlign',
  'string.ipVersion',
  'string.uriCustomScheme',
  'string.uriRelativeOnly',
  'symbol.base',
];

type ErrorMessageOptions = {
  type?: string;
  keysToIgnore?: string[];
};

export function setDefaultErrorMessage(
  message: string,
  options?: ErrorMessageOptions,
): {
  [key: string]: string;
} {
  if (!options) {
    return { ['*']: message };
  }
  const defaultErrorMessage = {};
  const joiKeysToUse = joiErrorKeys
    .filter(key => {
      if (options?.type) return key.includes(options.type);
      return true;
    })
    .filter(key => {
      if (options?.keysToIgnore) return !options.keysToIgnore.includes(key);
      return true;
    });

  joiKeysToUse.forEach(key => {
    defaultErrorMessage[key] = message;
  });
  return defaultErrorMessage;
}
