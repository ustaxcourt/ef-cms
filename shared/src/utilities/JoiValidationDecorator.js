const joi = require('joi');
const { InvalidEntityError } = require('../errors/errors');
const { isEmpty } = require('lodash');

const setIsValidated = obj => {
  Object.defineProperty(obj, 'isValidated', {
    enumerable: false,
    value: true,
    writable: false,
  });
};

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
  if (entity.isValidated) {
    setIsValidated(obj);
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
  if (!entityConstructor['__proxy__']) {
    entityConstructor = exports.validEntityDecorator(entityConstructor);
  }
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

  entityConstructor.prototype.validateForMigration =
    function validateForMigration() {
      let { error } = schema.validate(this, {
        abortEarly: false,
        allowUnknown: true,
      });

      if (error) {
        console.log('entity with error-------------', this);
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
    };

  entityConstructor.prototype.validate = function validate(options) {
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
        applicationContext.logger.error('*** Entity with error: ***', this);
      }
      const validationErrors = this.getValidationErrors();
      throw new InvalidEntityError(
        this.entityName,
        JSON.stringify(stringifyTransform(validationErrors)),
        validationErrors,
      );
    }
    setIsValidated(this);
    return this;
  };

  entityConstructor.prototype.validateWithLogging =
    function validateWithLogging(applicationContext) {
      return this.validate({ applicationContext, logErrors: true });
    };

  entityConstructor.prototype.getFormattedValidationErrors = function () {
    return getFormattedValidationErrors(this);
  };

  entityConstructor.prototype.getValidationErrors =
    function getValidationErrors() {
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

  entityConstructor.validateRawCollection = function (collection, args) {
    const validRawEntity = entity =>
      new entityConstructor(entity, args).validate().toRawObject();
    return (collection || []).map(validRawEntity);
  };

  entityConstructor.validateCollection = function (collection) {
    return collection.map(entity => entity.validate());
  };
};

/**
 * Creates a new Proxy object from the provided entity constructor.
 * When the returned function is invoked with the 'new' keyword, a proxy
 * instance of the original entity is returned which trims incoming string values.
 *
 * @param {Function} entityConstructor the entity constructor
 * @returns {Function} a factory function with proxy trap for 'construct' and
 *   proxy trap for 'set' on the returned instances
 */
exports.validEntityDecorator = entityFactoryFunction => {
  const hasInitFunction =
    typeof entityFactoryFunction === 'function' &&
    typeof entityFactoryFunction.prototype.init === 'function';

  if (!hasInitFunction) {
    console.warn(
      `WARNING: ${entityFactoryFunction.name} prototype has no 'init' function`,
    );
  }

  const instanceHandler = {
    set(target, prop, value) {
      if (typeof value === 'string') {
        value = value.trim();
      }
      target[prop] = value;
      return true;
    },
  };
  const factoryHandler = {
    construct(target, args) {
      const entityInstance = new target(...args);
      const proxied = new Proxy(entityInstance, instanceHandler);
      proxied.init && proxied.init(...args);
      return proxied;
    },
  };
  const ValidEntityProxy = new Proxy(entityFactoryFunction, factoryHandler);
  Object.defineProperty(ValidEntityProxy, '__proxy__', {
    iterable: false,
    value: true,
    writable: false,
  });
  return ValidEntityProxy;
};

exports.getFormattedValidationErrorsHelper = getFormattedValidationErrorsHelper;
