jest.mock('@shared/sharedAppContext');
import { CONTACT_TYPES, PARTY_TYPES } from '../EntityConstants';
import { Case } from './Case';
import { MOCK_CASE } from '../../../test/mockCase';
import { mockDocketClerkUser } from '@shared/test/mockAuthUsers';
import { getUniqueId as getUniqueIdMock } from '@shared/sharedAppContext';

describe('updatePetitioner', () => {
  const getUniqueId = jest.mocked(getUniqueIdMock);
  it('should throw an error when the petitioner to update is not found on the case', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
      },
      { authorizedUser: mockDocketClerkUser },
    );

    expect(() =>
      myCase.updatePetitioner({ updatedPetitioner: { contactId: 'badId' } }),
    ).toThrow('Petitioner was not found');
  });

  it('should update the petitioner when found on case', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
      },
      { authorizedUser: mockDocketClerkUser },
    );

    myCase.updatePetitioner({
      updatedPetitioner: {
        contactId: myCase.petitioners[0].contactId,
        contactType: CONTACT_TYPES.primary,
        name: undefined,
      },
    });

    const updatedCaseRaw = myCase.validate().toRawObject();

    // send back through the constructor so contacts are recreated as entities
    const updatedCaseEntity = new Case(updatedCaseRaw, {
      authorizedUser: mockDocketClerkUser,
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
      { authorizedUser: mockDocketClerkUser },
    );

    myCase.updatePetitioner({
      updatedPetitioner: {
        contactId: SECONDARY_CONTACT_ID,
        contactType: CONTACT_TYPES.secondary,
        name: undefined,
      },
    });

    const updatedCaseRaw = myCase.validate().toRawObject();

    // send back through the constructor so contacts are recreated as entities
    const updatedCaseEntity = new Case(updatedCaseRaw, {
      authorizedUser: mockDocketClerkUser,
    });

    expect(updatedCaseEntity.isValid()).toBeFalsy();
  });

  it('should update the petitioner contactId', () => {
    const oldId = MOCK_CASE.petitioners[0].contactId;
    const newId = 'bbd3a059-dafe-441a-9dfc-80e476ff24d1';
    getUniqueId.mockReturnValue(newId);
    const myCase = new Case(
      {
        ...MOCK_CASE,
      },
      { authorizedUser: mockDocketClerkUser },
    );

    const updatedPetitioner = myCase.updatePetitioner({
      updatedPetitioner: {
        contactId: oldId,
        contactType: CONTACT_TYPES.primary,
        name: undefined,
      },
      assignNewId: true,
    });

    expect(updatedPetitioner.contactId).toEqual(newId);

    expect(myCase.getPetitionerById(oldId)).toBeFalsy();

    myCase.validate().toRawObject();
  });
});
