import {
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  PARTY_TYPES,
  ROLES,
} from '../EntityConstants';
import { Case, getContactPrimary, getContactSecondary } from './Case';
import {
  MOCK_CASE,
  MOCK_CASE_WITH_PETITIONER_DECEASED_SPOUSE,
} from '../../../test/mockCase';
import { applicationContext } from '../../test/createTestApplicationContext';

describe('setAdditionalNameOnPetitioners', () => {
  const mockSecondaryName = 'Test Secondary Name';
  const mockTitle = 'Test Title';
  const mockInCareOf = 'Test In Care Of';
  const partyTypesWithSecondaryName = [
    PARTY_TYPES.conservator,
    PARTY_TYPES.custodian,
    PARTY_TYPES.guardian,
    PARTY_TYPES.nextFriendForIncompetentPerson,
    PARTY_TYPES.nextFriendForMinor,
    PARTY_TYPES.partnershipOtherThanTaxMatters,
    PARTY_TYPES.partnershipBBA,
    PARTY_TYPES.trust,
  ];

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.docketClerk,
    });
  });

  partyTypesWithSecondaryName.forEach(partyType => {
    it(`should set additionalName as secondaryName when party type is ${partyType}`, () => {
      const myCase = new Case(
        {
          ...MOCK_CASE,
          partyType,
          petitioners: [
            {
              ...getContactPrimary(MOCK_CASE),
              contactType: CONTACT_TYPES.petitioner,
              secondaryName: mockSecondaryName,
            },
          ],
          status: CASE_STATUS_TYPES.generalDocket,
        },
        { applicationContext },
      );

      expect(myCase.petitioners[0].additionalName).toBe(mockSecondaryName);
    });
  });

  it('should set additionalName as "c/o secondaryName" when party type is Surviving spouse', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        partyType: 'Surviving spouse',
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            contactType: CONTACT_TYPES.petitioner,
            secondaryName: mockSecondaryName,
          },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      },
      { applicationContext },
    );

    expect(myCase.petitioners[0].additionalName).toBe(
      `c/o ${mockSecondaryName}`,
    );
  });

  it('should set additionalName as `name of executor, title` when partyType is estateWithExecutor', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.estate,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            contactType: CONTACT_TYPES.petitioner,
            secondaryName: mockSecondaryName,
            title: mockTitle,
          },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      },
      { applicationContext },
    );

    expect(myCase.petitioners[0].additionalName).toBe(
      `${mockSecondaryName}, ${mockTitle}`,
    );
  });

  it('should set additionalName as `name of executor` when partyType is estateWithExecutor and title is undefined', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.estate,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            contactType: CONTACT_TYPES.petitioner,
            secondaryName: mockSecondaryName,
            title: undefined,
          },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      },
      { applicationContext },
    );

    expect(myCase.petitioners[0].additionalName).toBe(mockSecondaryName);
  });

  it('should set additionalName as undefined when partyType is estateWithExecutor and secondaryName and title are undefined', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.estate,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            contactType: CONTACT_TYPES.petitioner,
            secondaryName: undefined,
            title: undefined,
          },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      },
      { applicationContext },
    );

    expect(myCase.petitioners[0].additionalName).toEqual('');
  });

  it('should set additionalName as `in care of` when partyType is estateWithoutExecutor', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.estateWithoutExecutor,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            contactType: CONTACT_TYPES.petitioner,
            inCareOf: mockInCareOf,
          },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      },
      { applicationContext },
    );

    expect(myCase.petitioners[0].additionalName).toBe(`c/o ${mockInCareOf}`);
  });

  it('should set additionalName as `secondaryName` when partyType is nextFriendForMinor', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.nextFriendForMinor,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            contactType: CONTACT_TYPES.petitioner,
            secondaryName: mockSecondaryName,
          },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      },
      { applicationContext },
    );

    expect(myCase.petitioners[0].additionalName).toBe(mockSecondaryName);
  });

  it('should set additionalName as `secondaryName` when partyType is partnershipBBA', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.partnershipBBA,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            contactType: CONTACT_TYPES.petitioner,
            secondaryName: mockSecondaryName,
          },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      },
      { applicationContext },
    );

    expect(myCase.petitioners[0].additionalName).toBe(mockSecondaryName);
  });

  it('should set additionalName as `secondaryName` when partyType is corporation', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.corporation,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            contactType: CONTACT_TYPES.petitioner,
            inCareOf: mockInCareOf,
          },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      },
      { applicationContext },
    );

    expect(myCase.petitioners[0].additionalName).toBe(`c/o ${mockInCareOf}`);
  });

  it('should set additionalName as `secondaryName` when partyType is petitionerDeceasedSpouse', () => {
    const myCase = new Case(
      {
        ...MOCK_CASE_WITH_PETITIONER_DECEASED_SPOUSE,
        partyType: PARTY_TYPES.petitionerDeceasedSpouse,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE_WITH_PETITIONER_DECEASED_SPOUSE),
          },
          {
            ...getContactSecondary(MOCK_CASE_WITH_PETITIONER_DECEASED_SPOUSE),
            inCareOf: mockInCareOf,
          },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      },
      { applicationContext },
    );

    expect(myCase.petitioners[0].additionalName).not.toBeDefined();
    expect(myCase.petitioners[1].additionalName).toBe(`c/o ${mockInCareOf}`);
  });

  it('should NOT set additionalName when it has already been set', () => {
    const mockAlreadySetAdditionalName = 'Anything at all';

    const myCase = new Case(
      {
        ...MOCK_CASE,
        partyType: PARTY_TYPES.corporation,
        petitioners: [
          {
            ...getContactPrimary(MOCK_CASE),
            additionalName: mockAlreadySetAdditionalName,
            contactType: CONTACT_TYPES.petitioner,
            inCareOf: mockInCareOf,
          },
        ],
        status: CASE_STATUS_TYPES.generalDocket,
      },
      { applicationContext },
    );

    expect(myCase.petitioners[0].additionalName).toBe(
      mockAlreadySetAdditionalName,
    );
  });
});
