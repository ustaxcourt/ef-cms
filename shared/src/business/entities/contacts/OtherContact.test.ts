import { OtherContact } from '@shared/business/entities/contacts/OtherContact';
import { PARTY_TYPES } from '@shared/business/entities/EntityConstants';

describe('OtherContact', () => {
  const VALID_ENTITY = {
    address1: 'TEST_ADDRESS_1',
    city: 'TEST_CITY',
    countryType: 'domestic',
    inCareOf: 'TEST_IN_CARE_OF',
    name: 'TEST_NAME',
    phone: 'TEST_PHONE',
    postalCode: '12345',
    secondaryName: 'TEST_SECONDARY_NAME',
    state: 'CA',
  };
  const TEST_PETITION_TYPE = 'TEST_PETITION_TYPE';
  const TEST_PARTY_TYPE = 'TEST_PARTY_TYPE';

  it('should create a valid instance of "OtherContact" entity', () => {
    const entity = new OtherContact(
      VALID_ENTITY,
      TEST_PETITION_TYPE,
      TEST_PARTY_TYPE,
    );

    const errors = entity.getFormattedValidationErrors();
    expect(errors).toEqual(null);
  });

  describe('VALIDATION', () => {
    describe('secondaryName', () => {
      it('should not return an error message for "secondaryName" is undefined and "partyType" is "estateWithoutExecutor"', () => {
        const entity = new OtherContact(
          {
            ...VALID_ENTITY,
            partyType: PARTY_TYPES.estateWithoutExecutor,
            secondaryName: undefined,
          },
          TEST_PETITION_TYPE,
          PARTY_TYPES.estateWithoutExecutor,
        );

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual(null);
      });

      [
        [PARTY_TYPES.trust, 'Enter name of trustee'],
        [PARTY_TYPES.conservator, 'Enter name of conservator'],
        [PARTY_TYPES.guardian, 'Enter name of guardian'],
        [PARTY_TYPES.custodian, 'Enter name of custodian'],
        [PARTY_TYPES.nextFriendForMinor, 'Enter name of next friend'],
        [
          PARTY_TYPES.nextFriendForIncompetentPerson,
          'Enter name of next friend',
        ],
        [PARTY_TYPES.survivingSpouse, 'Enter name of surviving spouse'],
        [PARTY_TYPES.estate, 'Enter name of executor/personal representative'],
        [undefined, 'Enter secondary name'],
      ].forEach(([partyType, errorMessage]) => {
        it(`should return an error message for "secondaryName" is undefined and "partyType" is "${partyType}"`, () => {
          const entity = new OtherContact(
            {
              ...VALID_ENTITY,
              partyType,
              secondaryName: undefined,
            },
            TEST_PETITION_TYPE,
            partyType,
          );

          const errors = entity.getFormattedValidationErrors();
          expect(errors).toMatchObject({ secondaryName: errorMessage });
        });
      });
    });

    describe('title', () => {
      it('should not return an error message for "title" when it is undefined and party type is not "estate"', () => {
        const entity = new OtherContact(
          {
            ...VALID_ENTITY,
            partyType: 'SOMETHING_ELSE',
            title: undefined,
          },
          TEST_PETITION_TYPE,
          'SOMETHING_ELSE',
        );

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual(null);
      });

      it('should return an error message for "title" when it is undefined and party type is "estate"', () => {
        const entity = new OtherContact(
          {
            ...VALID_ENTITY,
            partyType: PARTY_TYPES.estate,
            title: undefined,
          },
          TEST_PETITION_TYPE,
          PARTY_TYPES.estate,
        );

        const errors = entity.getFormattedValidationErrors();
        expect(errors).toEqual({ title: 'Enter title' });
      });
    });
  });
});
