const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const { Case } = require('./Case');
const { CONTACT_TYPES, PARTY_TYPES } = require('../EntityConstants');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('updatePetitioner', () => {
  it('should throw an error when the petitioner to update is not found on the case', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
      },
      { applicationContext },
    );

    expect(() => myCase.updatePetitioner({ contactId: 'badId' })).toThrow(
      'Petitioner was not found',
    );
  });

  it('should update the petitioner when found on case', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
      },
      { applicationContext },
    );

    myCase.updatePetitioner({
      contactId: myCase.petitioners[0].contactId,
      contactType: CONTACT_TYPES.primary,
      name: undefined,
    });

    const updatedCaseRaw = myCase.validate().toRawObject();

    // send back through the constructor so contacts are recreated as entities
    const updatedCaseEntity = new Case(updatedCaseRaw, {
      applicationContext,
    });

    expect(updatedCaseEntity.petitioners[0]).toMatchObject({
      name: undefined,
    });
    expect(updatedCaseEntity.isValid()).toBeFalsy();
  });

  it('should fail to validate an invalid secondaryContact', () => {
    const SECONDARY_CONTACT_ID = 'd7d90c05-f6cd-442c-a168-202db587f16f';

    const myCase = new Case(
      {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.petitionerSpouse,
        petitioners: [
          ...MOCK_CASE.petitioners,
          {
            ...MOCK_CASE.petitioners[0],
            contactId: SECONDARY_CONTACT_ID,
            contactType: CONTACT_TYPES.secondary,
            name: 'Jimmy Jazz',
          },
        ],
      },
      { applicationContext },
    );

    myCase.updatePetitioner({
      contactId: SECONDARY_CONTACT_ID,
      contactType: CONTACT_TYPES.secondary,
      name: undefined,
    });

    const updatedCaseRaw = myCase.validate().toRawObject();

    // send back through the constructor so contacts are recreated as entities
    const updatedCaseEntity = new Case(updatedCaseRaw, {
      applicationContext,
    });

    expect(updatedCaseEntity.isValid()).toBeFalsy();
  });
});
