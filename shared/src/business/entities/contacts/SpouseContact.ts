import { ContactUpdated } from '@shared/business/entities/contacts/ContactUpdated';
import { JoiValidationConstants } from '../JoiValidationConstants';
import joi from 'joi';

export class SpouseContact extends ContactUpdated {
  constructor(rawContact, petitionType, partyType) {
    super(rawContact, 'SpouseContact', petitionType, partyType);
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      hasConsentedToEService: joi
        .boolean()
        .optional()
        .description(
          'Flag that indicates if the petitioner checked the "I consent to electronic service" box on their petition form',
        ),
      paperPetitionEmail: JoiValidationConstants.EMAIL.when(
        'hasConsentedToEService',
        {
          is: true,
          otherwise: joi.optional(),
          then: joi.string().required(),
        },
      ).messages({
        'any.required':
          'Enter an email address to register for electronic service',
        'string.email': 'Enter email address in format: yourname@example.com',
      }),
      phone: JoiValidationConstants.STRING.max(100).optional().allow(null),
    };
  }
}
