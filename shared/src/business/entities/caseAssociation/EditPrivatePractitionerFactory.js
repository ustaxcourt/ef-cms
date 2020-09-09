const joi = require('joi');
const {
  AddPrivatePractitionerFactory,
} = require('./AddPrivatePractitionerFactory');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  makeRequiredHelper,
} = require('../externalDocument/externalDocumentHelpers');

/**
 *
 * @constructor
 */
function EditPrivatePractitionerFactory() {}

EditPrivatePractitionerFactory.VALIDATION_ERROR_MESSAGES = {
  ...AddPrivatePractitionerFactory.VALIDATION_ERROR_MESSAGES,
};

/**
 *
 * @param {object} metadata the metadata
 * @returns {object} the instance
 */
EditPrivatePractitionerFactory.get = metadata => {
  /**
   *
   */
  function entityConstructor() {}
  entityConstructor.prototype.init = function init(rawProps) {
    Object.assign(this, {
      representingPrimary: rawProps.representingPrimary,
      representingSecondary: rawProps.representingSecondary,
    });
  };

  let schema = {};

  let schemaOptionalItems = {
    representingPrimary: joi.boolean().invalid(false),
    representingSecondary: joi.boolean(),
  };

  const makeRequired = itemName => {
    makeRequiredHelper({
      itemName,
      schema,
      schemaOptionalItems,
    });
  };

  if (
    metadata.representingPrimary !== true &&
    metadata.representingSecondary !== true
  ) {
    makeRequired('representingPrimary');
  }

  joiValidationDecorator(
    entityConstructor,
    schema,
    EditPrivatePractitionerFactory.VALIDATION_ERROR_MESSAGES,
  );

  return new (validEntityDecorator(entityConstructor))(metadata);
};

module.exports = { EditPrivatePractitionerFactory };
