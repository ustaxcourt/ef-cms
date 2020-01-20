const joi = require('@hapi/joi');
const {
  joiValidationDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  makeRequiredHelper,
} = require('../externalDocument/externalDocumentHelpers');
const { AddPractitionerFactory } = require('./AddPractitionerFactory');

/**
 *
 * @constructor
 */
function EditPractitionerFactory() {}

EditPractitionerFactory.VALIDATION_ERROR_MESSAGES = {
  ...AddPractitionerFactory.VALIDATION_ERROR_MESSAGES,
};

/**
 *
 * @param {object} metadata the metadata
 * @returns {object} the instance
 */
EditPractitionerFactory.get = metadata => {
  let entityConstructor = function(rawProps) {
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

  let customValidate;

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
    customValidate,
    EditPractitionerFactory.VALIDATION_ERROR_MESSAGES,
  );

  return new entityConstructor(metadata);
};

module.exports = { EditPractitionerFactory };
