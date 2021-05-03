const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const {
  makeRequiredHelper,
} = require('../externalDocument/externalDocumentHelpers');
const { SERVICE_INDICATOR_TYPES } = require('../EntityConstants');

/**
 *
 * @constructor
 */
function AddPetitionerCounselFactory() {}

AddPetitionerCounselFactory.VALIDATION_ERROR_MESSAGES = {
  representingPrimary: 'Select a represented party',
  representingSecondary: 'Select a represented party',
  serviceIndicator: [
    {
      contains: 'must be one of',
      message:
        'No email found for electronic service. Select a valid service preference.',
    },
    'Select service type',
  ],
  user: 'Select a petitioner counsel',
};

/**
 *
 * @param {object} metadata the metadata
 * @returns {object} the instance
 */
AddPetitionerCounselFactory.get = metadata => {
  /**
   *
   */
  function entityConstructor() {}
  entityConstructor.prototype.init = function init(rawProps) {
    Object.assign(this, {
      email: rawProps.user?.email,
      representingPrimary: rawProps.representingPrimary,
      representingSecondary: rawProps.representingSecondary,
      serviceIndicator: rawProps.serviceIndicator,
      user: rawProps.user,
    });
  };

  let schema = {
    email: JoiValidationConstants.STRING.optional(),
    serviceIndicator: joi
      .when('email', {
        is: joi.exist().not(null),
        otherwise: JoiValidationConstants.STRING.valid(
          SERVICE_INDICATOR_TYPES.SI_NONE,
          SERVICE_INDICATOR_TYPES.SI_PAPER,
        ),
        then: JoiValidationConstants.STRING.valid(
          ...Object.values(SERVICE_INDICATOR_TYPES),
        ),
      })
      .required(),
    user: joi.object().required(),
  };

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
    AddPetitionerCounselFactory.VALIDATION_ERROR_MESSAGES,
  );

  return new (validEntityDecorator(entityConstructor))(metadata);
};

module.exports = { AddPetitionerCounselFactory };
