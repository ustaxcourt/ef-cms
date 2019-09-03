const joi = require('joi-browser');

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
      obj[key] = value.map(v => toRawObject(v));
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
        } else {
          errors[key] = errorObject;
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
  if (entity && entity.getFormattedValidationErrors) {
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
 * @param {Function} customValidate a custom validation function
 * @param {object} errorToMessageMap the map of error fields and messages
 */
exports.joiValidationDecorator = function(
  entityConstructor,
  schema,
  customValidate,
  errorToMessageMap = {},
) {
  entityConstructor.prototype.getErrorToMessageMap = function() {
    return errorToMessageMap;
  };

  entityConstructor.prototype.getSchema = function() {
    return schema;
  };

  entityConstructor.prototype.isValid = function isValid() {
    return (
      joi.validate(this, schema, { allowUnknown: true }).error === null &&
      (customValidate ? customValidate.call(this) : true)
    );
  };

  entityConstructor.prototype.getValidationError = function getValidationError() {
    return joi.validate(this, schema, { allowUnknown: true }).error;
  };

  entityConstructor.prototype.validate = function validate() {
    if (!this.isValid()) {
      throw new Error(
        `The ${entityConstructor.validationName ||
          ''} entity was invalid ${this.getValidationError()}`,
      );
    }
    return this;
  };

  entityConstructor.prototype.getFormattedValidationErrors = function() {
    return getFormattedValidationErrors(this);
  };

  entityConstructor.prototype.getValidationErrors = function getValidationErrors() {
    const { error } = joi.validate(this, schema, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (!error) return null;
    const errors = {};
    error.details.forEach(detail => {
      if (!Number.isInteger(detail.context.key)) {
        errors[detail.context.key] = detail.message;
      } else {
        errors[detail.context.label] = detail.message;
      }
    });
    return errors;
  };

  entityConstructor.prototype.validateWithError = function validate(error) {
    if (!this.isValid()) {
      error.message = `${error.message} ${this.getValidationError()}`;
      throw error;
    }
    return this;
  };

  entityConstructor.prototype.toRawObject = function convertToRawObject() {
    return toRawObject(this);
  };

  entityConstructor.validateRawCollection = function(
    collection,
    { applicationContext },
  ) {
    return collection.map(entity =>
      new entityConstructor(entity, { applicationContext })
        .validate()
        .toRawObject(),
    );
  };

  entityConstructor.validateCollection = function(collection) {
    return collection.map(entity => entity.validate());
  };
};

exports.getFormattedValidationErrorsHelper = getFormattedValidationErrorsHelper;
