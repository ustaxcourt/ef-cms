import { JoiValidationConstants } from '../JoiValidationConstants';
import { SERVICE_INDICATOR_TYPES } from '../EntityConstants';
import {
  joiValidationDecorator,
  validEntityDecorator,
} from '../JoiValidationDecorator';
import joi from 'joi';

/**
 *
 * @param {object} rawProps the metadata
 * @constructor
 */
function AddIrsPractitionerClass() {}
AddIrsPractitionerClass.prototype.init = function init(rawProps) {
  Object.assign(this, {
    email: rawProps.user?.email,
    serviceIndicator: rawProps.serviceIndicator,
    user: rawProps.user,
  });
};

AddIrsPractitionerClass.VALIDATION_ERROR_MESSAGES = {
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

AddIrsPractitionerClass.schema = joi.object().keys({
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
  AddIrsPractitionerClass,
  AddIrsPractitionerClass.schema,
  AddIrsPractitionerClass.VALIDATION_ERROR_MESSAGES,
);

export const AddIrsPractitioner = validEntityDecorator(AddIrsPractitionerClass);
