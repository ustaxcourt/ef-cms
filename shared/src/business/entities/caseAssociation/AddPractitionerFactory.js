const joi = require('joi-browser');
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
function AddPractitionerFactory() {}

/**
 *
 * @param {object} metadata the metadata
 * @returns {object} the instance
 */
AddPractitionerFactory.get = metadata => {
  let entityConstructor = function(rawProps) {
    Object.assign(this, {
      representingPrimary: rawProps.representingPrimary,
      representingSecondary: rawProps.representingSecondary,
      user: rawProps.user,
    });
  };

  let schema = {
    user: joi.object().required(),
  };

  let schemaOptionalItems = {
    representingPrimary: joi.boolean().invalid(false),
    representingSecondary: joi.boolean(),
  };

  let errorToMessageMap = {
    representingPrimary: 'Select a represented party',
    representingSecondary: 'Select a represented party',
    user: 'Select a petitioner counsel',
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
    errorToMessageMap,
  );

  return new entityConstructor(metadata);
};

module.exports = { AddPractitionerFactory };
