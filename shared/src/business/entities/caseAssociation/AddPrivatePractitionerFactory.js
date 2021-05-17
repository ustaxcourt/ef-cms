const joi = require('joi');
const {
  JoiValidationConstants,
} = require('../../../utilities/JoiValidationConstants');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../../../utilities/JoiValidationDecorator');
const { SERVICE_INDICATOR_TYPES } = require('../EntityConstants');

/**
 *
 * @constructor
 */
function AddPrivatePractitionerFactory() {}

AddPrivatePractitionerFactory.VALIDATION_ERROR_MESSAGES = {
  representing: 'Select a represented party',
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
AddPrivatePractitionerFactory.get = metadata => {
  /**
   *
   */
  function entityConstructor() {}
  entityConstructor.prototype.init = function init(rawProps) {
    Object.assign(this, {
      email: rawProps.user?.email,
      representing: rawProps.representing,
      serviceIndicator: rawProps.serviceIndicator,
      user: rawProps.user,
    });
  };

  const schema = {
    email: JoiValidationConstants.STRING.optional(),
    representing: joi
      .array()
      .items(JoiValidationConstants.UUID.required())
      .required(),
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

  joiValidationDecorator(
    entityConstructor,
    schema,
    AddPrivatePractitionerFactory.VALIDATION_ERROR_MESSAGES,
  );

  return new (validEntityDecorator(entityConstructor))(metadata);
};

module.exports = { AddPrivatePractitionerFactory };
