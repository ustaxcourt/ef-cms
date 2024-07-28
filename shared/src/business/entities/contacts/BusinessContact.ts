import { ContactUpdated } from './ContactUpdated';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { PARTY_TYPES, US_STATES, US_STATES_OTHER } from '../EntityConstants';
import joi from 'joi';

export class BusinessContact extends ContactUpdated {
  constructor(rawContact, petitionType, partyType) {
    super(rawContact, 'BusinessContact', petitionType, partyType);
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      placeOfLegalResidence: JoiValidationConstants.STRING.optional()
        .valid(
          ...Object.keys(US_STATES),
          ...Object.keys(US_STATES_OTHER),
          'Other',
        )

        .messages({ '*': 'Enter a place of business' }),
      secondaryName: JoiValidationConstants.STRING.max(500)
        .when('partyType', {
          is: PARTY_TYPES.corporation,
          otherwise: joi.required(),
          then: joi.optional(),
        })
        .messages({ '*': this.getMessageBasedOnPartyType() }),
    };
  }

  getMessageBasedOnPartyType() {
    switch (this.partyType) {
      case PARTY_TYPES.partnershipAsTaxMattersPartner:
        return 'Enter Tax Matters Partner name';
      case PARTY_TYPES.partnershipBBA:
        return 'Enter partnership representative name';
      case PARTY_TYPES.partnershipOtherThanTaxMatters:
        return 'Enter name of partner';
      default:
        return 'Enter secondary name';
    }
  }
}

export type RawBusinessContact = ExcludeMethods<
  Omit<BusinessContact, 'entityName'>
>;
