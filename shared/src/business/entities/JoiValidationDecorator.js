const joi = require('joi-browser');

exports.joiValidationDecorator = function(entityConstructor, schema) {
  entityConstructor.prototype.isValid = function isValid() {
    return joi.validate(this, schema).error === null;
  };

  entityConstructor.prototype.getValidationError = function getValidationError() {
    return joi.validate(this, schema).error;
  };

  entityConstructor.prototype.validate = function validate() {
    if (!this.isValid()) {
      throw new Error('The entity was invalid ' + this.getValidationError());
    }
  };

  entityConstructor.prototype.validateWithError = function validate(error) {
    if (!this.isValid()) {
      error.message = `${error.message} ${this.getValidationError()}`;
      throw error;
    }
  };
};
