import { ContactUpdated } from '@shared/business/entities/contacts/ContactUpdated';
import { JoiValidationConstants } from '../JoiValidationConstants';
import joi from 'joi';

export class DeceasedSpouseContact extends ContactUpdated {
  constructor(rawContact, petitionType, partyType) {
    super(rawContact, 'DeceasedSpouseContact', petitionType, partyType);
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      email: JoiValidationConstants.EMAIL.when('hasConsentedToEService', {
        is: true,
        otherwise: joi.optional(),
        then: joi.string().required(),
      }).messages({
        '*': 'Enter an email address to register for electronic service',
      }),
      hasConsentedToEService: joi
        .boolean()
        .optional()
        .description(
          'Flag that indicates if the petitioner checked the "I consent to electronic service" box on their petition form',
        ),
      inCareOf: JoiValidationConstants.STRING.max(100)
        .required()
        .messages({ '*': 'Enter name for in care of' }),
      phone: JoiValidationConstants.STRING.max(100).optional().allow(null),
    };
  }
}
