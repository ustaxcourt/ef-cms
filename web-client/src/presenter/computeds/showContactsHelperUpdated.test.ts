import {
  FILING_TYPES,
  PARTY_TYPES,
  PartyType,
} from '@shared/business/entities/EntityConstants';
import { showContactsHelperUpdated } from '@web-client/presenter/computeds/showContactsHelperUpdated';

describe('showContactsHelperUpdated', () => {
  describe('showContactPrimary', () => {
    it('should return showContactPrimary as true when there is a valid party type', () => {
      const { showContactPrimary } = showContactsHelperUpdated({
        filingType: FILING_TYPES.petitioner[3],
        isSpousedDeceased: false,
        partyType: PARTY_TYPES.conservator,
      });

      expect(showContactPrimary).toEqual(true);
    });

    it('should return showContactPrimary as false when there is not a valid party type', () => {
      const { showContactPrimary } = showContactsHelperUpdated({
        filingType: FILING_TYPES.petitioner[3],
        isSpousedDeceased: false,
        partyType: 'RANDOM_TYPE' as PartyType,
      });

      expect(showContactPrimary).toEqual(false);
    });

    it('should return showContactPrimary as true when the filling type is "Myself and my spouse"', () => {
      const { showContactPrimary } = showContactsHelperUpdated({
        filingType: FILING_TYPES.petitioner[1],
        isSpousedDeceased: false,
        partyType: PARTY_TYPES.petitionerSpouse,
      });

      expect(showContactPrimary).toEqual(true);
    });

    it('should return showContactPrimary as true when the filling type is "Myself"', () => {
      const { showContactPrimary } = showContactsHelperUpdated({
        filingType: FILING_TYPES.petitioner[0],
        isSpousedDeceased: false,
        partyType: PARTY_TYPES.petitioner,
      });

      expect(showContactPrimary).toEqual(true);
    });
  });

  describe('showContactSecondary', () => {
    it('should return showContactSecondary as false when party type is neither "petitionerDeceasedSpouse" or "petitionerSpouse"', () => {
      const { showContactSecondary } = showContactsHelperUpdated({
        filingType: FILING_TYPES.petitioner[0],
        isSpousedDeceased: false,
        partyType: PARTY_TYPES.petitioner,
      });

      expect(showContactSecondary).toEqual(false);
    });

    it('should return showContactSecondary as false when user is a pro se petitioner and spouse is not deceased', () => {
      const { showContactSecondary } = showContactsHelperUpdated({
        filingType: FILING_TYPES.petitioner[1],
        isSpousedDeceased: false,
        partyType: PARTY_TYPES.petitionerSpouse,
      });

      expect(showContactSecondary).toEqual(false);
    });

    it('should return showContactSecondary as true when user is a private practitioner and spouse is deceased', () => {
      const { showContactSecondary } = showContactsHelperUpdated({
        filingType: FILING_TYPES.privatePractitioner[1],
        isSpousedDeceased: true,
        partyType: PARTY_TYPES.petitionerSpouse,
      });

      expect(showContactSecondary).toEqual(true);
    });
  });
});
