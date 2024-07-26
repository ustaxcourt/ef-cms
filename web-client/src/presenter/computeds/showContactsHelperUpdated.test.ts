import { PARTY_TYPES } from '@shared/business/entities/EntityConstants';
import { showContactsHelperUpdated } from '@web-client/presenter/computeds/showContactsHelperUpdated';

describe('showContactsHelperUpdated', () => {
  describe('showContactPrimary', () => {
    it('should return showContactPrimary as true when the party type is included in type object being passed in', () => {
      const TEST_PROPS = {};

      const { showContactPrimary } = showContactsHelperUpdated(
        'conservator',
        {
          conservator: 'conservator',
        },
        TEST_PROPS,
      );

      expect(showContactPrimary).toEqual(true);
    });

    it('should return showContactPrimary as false when the party type is not included in type object being passed in', () => {
      const TEST_PROPS = {};

      const { showContactPrimary } = showContactsHelperUpdated(
        'RANDOM TYPE',
        {
          conservator: 'conservator',
        },
        TEST_PROPS,
      );

      expect(showContactPrimary).toEqual(false);
    });

    it('should return showContactPrimary as true when the filling type is "Myself and my spouse"', () => {
      const TEST_PROPS = {
        value: 'Myself and my spouse',
      };

      const { showContactPrimary } = showContactsHelperUpdated(
        'RANDOM TYPE',
        {
          conservator: 'conservator',
        },
        TEST_PROPS,
      );

      expect(showContactPrimary).toEqual(true);
    });

    it('should return showContactPrimary as true when the filling type is "Myself"', () => {
      const TEST_PROPS = {
        value: 'Myself',
      };

      const { showContactPrimary } = showContactsHelperUpdated(
        'RANDOM TYPE',
        {
          conservator: 'conservator',
        },
        TEST_PROPS,
      );

      expect(showContactPrimary).toEqual(true);
    });
  });

  describe('showContactSecondary', () => {
    it('should return showContactSecondary as false when party type is neither "petitionerDeceasedSpouse" or "petitionerSpouse"', () => {
      const TEST_PROPS = {};

      const { showContactSecondary } = showContactsHelperUpdated(
        'conservator',
        {
          conservator: 'conservator',
        },
        TEST_PROPS,
      );

      expect(showContactSecondary).toEqual(false);
    });

    it('should return showContactSecondary as false when party type is "petitionerDeceasedSpouse" but key in props is not "isSpouseDeceased"', () => {
      const TEST_PROPS = {
        key: 'RANDOM KEY',
      };

      const { showContactSecondary } = showContactsHelperUpdated(
        PARTY_TYPES.petitionerDeceasedSpouse,
        {
          petitionerDeceasedSpouse: PARTY_TYPES.petitionerDeceasedSpouse,
        },
        TEST_PROPS,
      );

      expect(showContactSecondary).toEqual(false);
    });

    it('should return showContactSecondary as false when party type is "petitionerDeceasedSpouse", key in props is  "isSpouseDeceased" but value in props is not "Yes"', () => {
      const TEST_PROPS = {
        key: 'isSpouseDeceased',
        value: 'NO',
      };

      const { showContactSecondary } = showContactsHelperUpdated(
        PARTY_TYPES.petitionerDeceasedSpouse,
        {
          petitionerDeceasedSpouse: PARTY_TYPES.petitionerDeceasedSpouse,
        },
        TEST_PROPS,
      );

      expect(showContactSecondary).toEqual(false);
    });

    it('should return showContactSecondary as true when party type is "petitionerDeceasedSpouse", key in props is  "isSpouseDeceased" and value in props is "Yes"', () => {
      const TEST_PROPS = {
        key: 'isSpouseDeceased',
        value: 'Yes',
      };

      const { showContactSecondary } = showContactsHelperUpdated(
        PARTY_TYPES.petitionerDeceasedSpouse,
        {
          petitionerDeceasedSpouse: PARTY_TYPES.petitionerDeceasedSpouse,
        },
        TEST_PROPS,
      );

      expect(showContactSecondary).toEqual(true);
    });
  });
});
