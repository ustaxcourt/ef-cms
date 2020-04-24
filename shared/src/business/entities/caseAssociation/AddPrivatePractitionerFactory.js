const joi = require('@hapi/joi');
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
function AddPrivatePractitionerFactory() {}

AddPrivatePractitionerFactory.VALIDATION_ERROR_MESSAGES = {
  representingPrimary: 'Select a represented party',
  representingSecondary: 'Select a represented party',
  user: 'Select a petitioner counsel',
};

/**
 *
 * @param {object} metadata the metadata
 * @returns {object} the instance
 */
AddPrivatePractitionerFactory.get = metadata => {
  let entityConstructor = function (rawProps) {
    this.entityName = 'AddPrivatePractitionerFactory';

    Object.assign(this, {
      representingPrimary: rawProps.representingPrimary,
      representingSecondary: rawProps.representingSecondary,
      user: rawProps.user,
    });
  };

  let schema = {
    entityName: joi.string().valid('AddPrivatePractitionerFactory').required(),
    user: joi.object().required(),
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
    AddPrivatePractitionerFactory.VALIDATION_ERROR_MESSAGES,
  );

  return new entityConstructor(metadata);
};

module.exports = { AddPrivatePractitionerFactory };
