const joi = require('joi-browser');

function toJSON(entity) {
  const keys = Object.keys(entity);
  const obj = {};
  for (let key of keys) {
    const value = entity[key];
    if (Array.isArray(value)) {
      obj[key] = value.map(v => toJSON(v));
    } else if (typeof value === 'object' && value !== null) {
      obj[key] = toJSON(value);
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

exports.joiValidationDecorator = function(
  entityConstructor,
  schema,
  customValidate,
) {
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
      throw new Error('The entity was invalid ' + this.getValidationError());
    }
    return this;
  };

  entityConstructor.prototype.validateWithError = function validate(error) {
    if (!this.isValid()) {
      error.message = `${error.message} ${this.getValidationError()}`;
      throw error;
    }
    return this;
  };

  entityConstructor.prototype.toJSON = function convertToJSON() {
    return toJSON(this);
  };

  entityConstructor.validateRawCollection = function(collection) {
    return collection.map(entity =>
      new entityConstructor(entity).validate().toJSON(),
    );
  };

  entityConstructor.validateCollection = function(collection) {
    return collection.map(entity => entity.validate());
  };
};
