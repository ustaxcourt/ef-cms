const joi = require('@hapi/joi');
const {
  AddPrivatePractitionerFactory,
} = require('./AddPrivatePractitionerFactory');
const {
  joiValidationDecorator,
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
  let entityConstructor = function (rawProps) {
    this.entityName = 'EditPrivatePractitionerFactory';

    Object.assign(this, {
      representingPrimary: rawProps.representingPrimary,
      representingSecondary: rawProps.representingSecondary,
    });
  };

  let schema = {
    entityName: joi.string().valid('EditPrivatePractitionerFactory').required(),
  };

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
    EditPrivatePractitionerFactory.VALIDATION_ERROR_MESSAGES,
  );

  return new entityConstructor(metadata);
};

module.exports = { EditPrivatePractitionerFactory };
