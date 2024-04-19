import { ContactUpdated } from './ContactUpdated';
import { JoiValidationConstants } from '../JoiValidationConstants';
import { PARTY_TYPES } from '../EntityConstants';
import joi from 'joi';

export class OtherContact extends ContactUpdated {
  constructor(rawContact, petitionType, partyType) {
    super(rawContact, 'OtherContact', petitionType, partyType);
  }

  getValidationRules() {
    return {
      ...super.getValidationRules(),
      secondaryName: JoiValidationConstants.STRING.max(500)
        .when('partyType', {
          is: PARTY_TYPES.estateWithoutExecutor,
          otherwise: joi.required(),
          then: joi.optional(),
        })
        .messages({ '*': this.getMessageBasedOnPartyType() }),
      // title: JoiValidationConstants.STRING.max(100)
      //   .when('partyType', {
      //     is: PARTY_TYPES.estate,
      //     otherwise: joi.optional(),
      //     then: joi.required(),
      //   })
      //   .messages({'*': }),
    };
  }

  getMessageBasedOnPartyType() {
    switch (this.partyType) {
      case PARTY_TYPES.trust:
        return 'Enter name of trustee';
      case PARTY_TYPES.conservator:
        return 'Enter name of conservator';
      case PARTY_TYPES.guardian:
        return 'Enter name of guardian';
      case PARTY_TYPES.custodian:
        return 'Enter name of custodian';
      case PARTY_TYPES.nextFriendForMinor:
        return 'Enter name of next friend';
      case PARTY_TYPES.nextFriendForIncompetentPerson:
        return 'Enter name of next friend';
      case PARTY_TYPES.survivingSpouse:
        return 'Enter name of surviving spouse';
      default:
        return '';
    }
  }
}
