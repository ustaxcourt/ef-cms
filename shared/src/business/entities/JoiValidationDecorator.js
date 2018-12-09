const joi = require('joi-browser');

exports.joiValidationDecorator = function(entityConstructor, schema) {
  entityConstructor.prototype.isValid = function isValid() {
    return (
      joi.validate(this, schema).error === null &&
      (this.preValidate ? this.preValidate() : true)
    );
  };

  entityConstructor.prototype.getValidationError = function getValidationError() {
    return joi.validate(this, schema).error;
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

  entityConstructor.prototype.toJSON = function toJSON() {
    return {
      ...this,
    };
  };

  entityConstructor.validateRawCollection = function(collection) {
    return collection.map(entity =>
      new entityConstructor(entity).validate().toJSON(),
    );
  };
};
