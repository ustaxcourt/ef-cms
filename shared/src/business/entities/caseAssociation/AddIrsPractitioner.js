const joi = require('joi');
const {
  joiValidationDecorator,
  validEntityDecorator,
} = require('../JoiValidationDecorator');
const { JoiValidationConstants } = require('../JoiValidationConstants');
const { SERVICE_INDICATOR_TYPES } = require('../EntityConstants');

/**
 *
 * @param {object} rawProps the metadata
 * @constructor
 */
function AddIrsPractitioner() {}
AddIrsPractitioner.prototype.init = function init(rawProps) {
  Object.assign(this, {
    email: rawProps.user?.email,
    serviceIndicator: rawProps.serviceIndicator,
    user: rawProps.user,
  });
};

AddIrsPractitioner.VALIDATION_ERROR_MESSAGES = {
  serviceIndicator: [
    {
      contains: 'must be one of',
      message:
        'No email found for electronic service. Select a valid service preference.',
    },
    'Select service type',
  ],
  user: 'Select a respondent counsel',
};

AddIrsPractitioner.schema = joi.object().keys({
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
});

joiValidationDecorator(
  AddIrsPractitioner,
  AddIrsPractitioner.schema,
  AddIrsPractitioner.VALIDATION_ERROR_MESSAGES,
);

module.exports = {
  AddIrsPractitioner: validEntityDecorator(AddIrsPractitioner),
};
