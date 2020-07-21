const joi = require('@hapi/joi');
const { InvalidEntityError } = require('../errors/errors');
const { isEmpty, pick } = require('lodash');

/**
 *
 * @param {Entity} entity the entity to convert to a raw object
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
  return obj;
}

/**
 *
 * @param {Entity} entity the entity to get formatted validation errors
 * @returns {object} errors (null if no errors)
 */
function getFormattedValidationErrorsHelper(entity) {
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

/**
 *
 * @param {Entity} entity the entity to get formatted validation errors
 * @returns {object} errors (null if no errors)
 */
function getFormattedValidationErrors(entity) {
  const keys = Object.keys(entity);
  const obj = {};
  let errors = null;
  if (entity.getFormattedValidationErrors) {
    errors = getFormattedValidationErrorsHelper(entity);
  }
  if (errors) {
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
  return Object.keys(obj).length === 0 ? null : obj;
}

/**
 *
 * @param {Function} entityConstructor the entity constructor
 * @param {object} schema the joi validation schema
 * @param {object} errorToMessageMap the map of error fields and messages
 */
exports.joiValidationDecorator = function (
  entityConstructor,
  schema,
  errorToMessageMap = {},
) {
  if (!schema.validate && typeof schema === 'object') {
    schema = joi.object().keys({ ...schema });
  }

  entityConstructor.prototype.getErrorToMessageMap = function () {
    return errorToMessageMap;
  };

  entityConstructor.prototype.getSchema = function () {
    return schema;
  };

  entityConstructor.getSchema = function () {
    return schema;
  };

  entityConstructor.prototype.isValid = function isValid() {
    const validationErrors = this.getFormattedValidationErrors();
    return isEmpty(validationErrors);
  };

  entityConstructor.prototype.validate = function validate() {
    if (!this.isValid()) {
      const helpfulKeys = Object.keys(this).filter(key => key.endsWith('Id'));
      helpfulKeys.push(
        'docketNumber',
        ...Object.keys(this.getFormattedValidationErrors()),
      );

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

      throw new InvalidEntityError(
        entityConstructor.validationName,
        JSON.stringify(
          stringifyTransform(pick(this, helpfulKeys)),
          (key, value) =>
            this.hasOwnProperty(key) && typeof value === 'undefined'
              ? '<undefined>'
              : value,
        ),
        JSON.stringify(stringifyTransform(this.getValidationErrors())),
      );
    }
    return this;
  };

  entityConstructor.prototype.getFormattedValidationErrors = function () {
    return getFormattedValidationErrors(this);
  };

  entityConstructor.prototype.getValidationErrors = function getValidationErrors() {
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
  };

  const toRawObjectPrototype = function () {
    return toRawObject(this);
  };

  entityConstructor.prototype.toRawObject = toRawObjectPrototype;

  entityConstructor.prototype.toRawObjectFromJoi = toRawObjectPrototype;

  entityConstructor.validateRawCollection = function (
    collection,
    { applicationContext },
  ) {
    return (collection || []).map(entity =>
      new entityConstructor(entity, { applicationContext })
        .validate()
        .toRawObject(),
    );
  };

  entityConstructor.validateCollection = function (collection) {
    return collection.map(entity => entity.validate());
  };
};

exports.getFormattedValidationErrorsHelper = getFormattedValidationErrorsHelper;
