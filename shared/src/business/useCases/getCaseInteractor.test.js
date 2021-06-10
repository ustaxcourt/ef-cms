const {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  PARTY_TYPES,
  ROLES,
} = require('../entities/EntityConstants');
const {
  getCaseInteractor,
  isAuthorizedForContact,
} = require('./getCaseInteractor');
const {
  getContactPrimary,
  getContactSecondary,
  getOtherFilers,
  getOtherPetitioners,
} = require('../entities/cases/Case');
const {
  MOCK_CASE,
  MOCK_CASE_WITH_SECONDARY_OTHERS,
} = require('../../test/mockCase');
const {
  ROLE_PERMISSIONS,
} = require('../../authorization/authorizationClientService');
const { applicationContext } = require('../test/createTestApplicationContext');
const { docketEntries } = MOCK_CASE;
const { cloneDeep } = require('lodash');

describe('getCaseInteractor', () => {
  const petitionsclerkId = '23c4d382-1136-492f-b1f4-45e893c34771';
  const docketClerkId = '44c4d382-1136-492f-b1f4-45e893c34771';
  const irsPractitionerId = '6cf19fba-18c6-467a-9ea6-7a14e42add2f';
  const practitionerId = '295c3640-7ff9-40bb-b2f1-8117bba084ea';
  const practitioner2Id = '42614976-4228-49aa-a4c3-597dae1c7220';

  const mockCaseContactPrimary = getContactPrimary(MOCK_CASE);

  it('should format the given docket number, removing leading zeroes and suffix', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(MOCK_CASE);

    await getCaseInteractor(applicationContext, {
      docketNumber: '000123-19S',
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[0][0],
    ).toEqual({
      applicationContext,
      docketNumber: '123-19',
    });
  });

  it('should throw an error when a case with the provided docketNumber is not found', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Tasha Yar',
      role: ROLES.petitionsClerk,
      userId: petitionsclerkId,
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({
          archivedCorrespondences: [],
          archivedDocketEntries: [],
          associatedJudge: [],
          correspondence: [],
          docketEntries: [],
          irsPractitioners: [],
          privatePractitioners: [],
        }),
      );

    await expect(
      getCaseInteractor(applicationContext, {
        docketNumber: '123-19',
      }),
    ).rejects.toThrow('Case 123-19 was not found.');
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls.length,
    ).toBe(1);
  });

  it('throws an error when the entity returned from persistence is invalid', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: petitionsclerkId,
    });
    const mockInvalidCase = { ...MOCK_CASE, caseCaption: undefined };
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockInvalidCase);

    await expect(
      getCaseInteractor(applicationContext, {
        docketNumber: '00101-08',
      }),
    ).rejects.toThrow('The Case entity was invalid');
  });

  it('should return the case when the currentUser is an unassociated IRS practitioner', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'IRS Practitionerr',
      role: ROLES.irsPractitioner,
      userId: irsPractitionerId,
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue({
        ...MOCK_CASE,
        docketNumber: '101-00',
        petitioners: [
          {
            ...mockCaseContactPrimary,
            contactId: 'dc56e26e-f9fd-4165-8997-97676cc0523e',
          },
        ],
        userId: '320fce0e-b050-4e04-8720-db25da3ca598',
      });

    const result = await getCaseInteractor(applicationContext, {
      docketNumber: '00101-00',
    });

    expect(result.docketNumber).toEqual('101-00');
  });

  it('should return the case when the currentUser is the contactPrimary on the case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      userId: 'dc56e26e-f9fd-4165-8997-97676cc0523e',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({
          ...MOCK_CASE,
          docketNumber: '101-00',
          petitioners: [
            {
              ...mockCaseContactPrimary,
              contactId: 'dc56e26e-f9fd-4165-8997-97676cc0523e',
            },
          ],
          userId: '320fce0e-b050-4e04-8720-db25da3ca598',
        }),
      );

    const result = await getCaseInteractor(applicationContext, {
      docketNumber: '00101-00',
    });

    expect(result.docketNumber).toEqual('101-00');
    expect(result.petitioners[0].address1).toBeDefined();
    expect(result.entityName).toEqual('Case');
  });

  it('should return the case when the currentUser is the contactSecondary on the case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      userId: '754a3191-884f-42f0-ad2c-e6c706685299',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue({
        ...MOCK_CASE,
        docketNumber: '101-00',
        partyType: PARTY_TYPES.petitionerSpouse,
        petitioners: [
          {
            ...mockCaseContactPrimary,
            contactId: '0898d5c3-2948-4924-b28b-d5c1451c80de',
          },
          {
            ...mockCaseContactPrimary,
            contactId: '754a3191-884f-42f0-ad2c-e6c706685299',
            contactType: CONTACT_TYPES.secondary,
          },
        ],
        userId: '320fce0e-b050-4e04-8720-db25da3ca598',
      });

    const result = await getCaseInteractor(applicationContext, {
      docketNumber: '00101-00',
    });

    expect(result.docketNumber).toEqual('101-00');
    expect(result.petitioners[0].address1).toBeDefined();
    expect(result.entityName).toEqual('Case');
  });

  describe('sealed contact information', () => {
    beforeAll(() => {
      const mockCaseWithSealed = cloneDeep(MOCK_CASE_WITH_SECONDARY_OTHERS);
      // seal ALL addresses present on this mock case
      getContactPrimary(mockCaseWithSealed).isAddressSealed = true;
      getContactSecondary(mockCaseWithSealed).isAddressSealed = true;
      getOtherFilers(mockCaseWithSealed).forEach(
        filer => (filer.isAddressSealed = true),
      );
      getOtherPetitioners(mockCaseWithSealed).forEach(
        filer => (filer.isAddressSealed = true),
      );
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(mockCaseWithSealed);
    });

    it(`allows unfiltered view of sealed contact addresses when role is ${ROLES.docketClerk}`, async () => {
      applicationContext.getCurrentUser.mockReturnValue({
        name: 'Security Officer Worf',
        role: ROLES.docketClerk,
        userId: docketClerkId,
      });
      const result = await getCaseInteractor(applicationContext, {
        docketNumber: '101-18',
      });

      const contactPrimary = getContactPrimary(result);
      const contactSecondary = getContactSecondary(result);

      expect(contactPrimary.city).toBeDefined();
      expect(contactPrimary.sealedAndUnavailable).toBe(false);
      expect(contactSecondary.city).toBeDefined();
      expect(contactSecondary.sealedAndUnavailable).toBe(false);
      getOtherFilers(result).forEach(filer => {
        expect(filer.city).toBeDefined();
        expect(filer.sealedAndUnavailable).toBe(false);
      });
      getOtherPetitioners(result).forEach(filer => {
        expect(filer.city).toBeDefined();
        expect(filer.sealedAndUnavailable).toBe(false);
      });
    });

    it('returns limited contact address information when address is sealed and requesting user is not docket clerk', async () => {
      applicationContext.getCurrentUser.mockReturnValue({
        name: 'Reginald Barclay',
        role: ROLES.privatePractitioner,
        userId: applicationContext.getUniqueId(),
      });

      const result = await getCaseInteractor(applicationContext, {
        docketNumber: '101-18',
      });

      expect(getContactPrimary(result).city).toBeUndefined();
      expect(getContactSecondary(result).city).toBeUndefined();
    });
  });

  describe('sealed cases', () => {
    beforeAll(() => {
      const sealedDocketEntries = cloneDeep(docketEntries);
      sealedDocketEntries[0].isSealed = true;
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(
          Promise.resolve({
            ...MOCK_CASE,
            caseCaption: 'a case caption',
            caseType: CASE_TYPES_MAP.other,
            createdAt: applicationContext.getUtilities().createISODateString(),
            docketEntries: sealedDocketEntries,
            docketNumber: '101-18',
            irsPractitioners: [
              {
                barNumber: 'BN1234',
                name: 'Wesley Crusher',
                role: ROLES.irsPractitioner,
                userId: irsPractitionerId,
              },
            ],
            preferredTrialCity: 'Washington, District of Columbia',
            privatePractitioners: [
              {
                barNumber: 'BN1234',
                name: 'Katherine Pulaski',
                role: ROLES.privatePractitioner,
                userId: practitionerId,
              },
            ],
            procedureType: 'Regular',
          }),
        );
    });

    it('should return a PublicCase entity when the current user is NOT authorized to view a sealed case and is NOT associated with the case', async () => {
      applicationContext.getCurrentUser.mockReturnValue({
        name: 'Tasha Yar',
        role: ROLES.privatePractitioner,
        userId: practitioner2Id,
      });

      const result = await getCaseInteractor(applicationContext, {
        docketNumber: '101-18',
      });

      expect(result).toEqual({
        caseCaption: undefined,
        contactSecondary: undefined,
        docketEntries: [],
        docketNumber: '101-18',
        docketNumberSuffix: undefined,
        docketNumberWithSuffix: '101-18',
        entityName: 'PublicCase',
        hasIrsPractitioner: false,
        isSealed: true,
        partyType: undefined,
        receivedAt: undefined,
      });
    });

    it('should return a Case entity when the current user is authorized to view a sealed case and is NOT associated with the case', async () => {
      applicationContext.getCurrentUser.mockReturnValue({
        name: 'Tasha Yar',
        role: ROLES.docketClerk,
        userId: docketClerkId,
      });

      const result = await getCaseInteractor(applicationContext, {
        docketNumber: '101-18',
      });

      const contactPrimary = getContactPrimary(result);

      expect(contactPrimary.address1).toBeDefined();
      expect(contactPrimary.phone).toBeDefined();
    });

    it('should return a Case entity when the current user is associated with a sealed case and NOT authorized to view it', async () => {
      applicationContext.getCurrentUser.mockReturnValue({
        name: 'Tasha Yar',
        role: ROLES.privatePractitioner,
        userId: practitionerId,
      });

      const result = await getCaseInteractor(applicationContext, {
        docketNumber: '101-18',
      });

      const contactPrimary = getContactPrimary(result);

      expect(contactPrimary.address1).toBeDefined();
      expect(contactPrimary.phone).toBeDefined();
    });
  });

  describe('cases that are NOT sealed', () => {
    beforeAll(() => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(
          Promise.resolve({
            ...MOCK_CASE,
            privatePractitioners: [
              {
                barNumber: 'BN1234',
                name: 'Katherine Pulaski',
                role: ROLES.privatePractitioner,
                userId: practitioner2Id,
              },
            ],
          }),
        );
    });

    it('should return a Case entity when the current user is an internal user', async () => {
      applicationContext.getCurrentUser.mockReturnValue({
        name: 'Tasha Yar',
        role: ROLES.docketClerk,
        userId: docketClerkId,
      });

      const result = await getCaseInteractor(applicationContext, {
        docketNumber: '101-18',
      });

      const contactPrimary = getContactPrimary(result);

      expect(contactPrimary.address1).toBeDefined();
      expect(contactPrimary.phone).toBeDefined();
    });

    it('should return a PublicCase entity when the current user is an external user who is NOT associated with the case', async () => {
      applicationContext.getCurrentUser.mockReturnValue({
        name: 'Tasha Yar',
        role: ROLES.privatePractitioner,
        userId: practitionerId,
      });

      const result = await getCaseInteractor(applicationContext, {
        docketNumber: '101-18',
      });

      const contactPrimary = getContactPrimary(result);

      expect(contactPrimary.address1).toBeUndefined();
      expect(contactPrimary.phone).toBeUndefined();
    });

    it('should return a Case entity when the current user is associated with the case', async () => {
      applicationContext.getCurrentUser.mockReturnValue({
        name: 'Tasha Yar',
        role: ROLES.privatePractitioner,
        userId: practitioner2Id,
      });

      const result = await getCaseInteractor(applicationContext, {
        docketNumber: '101-18',
      });

      const contactPrimary = getContactPrimary(result);

      expect(contactPrimary.address1).toBeDefined();
      expect(contactPrimary.phone).toBeDefined();
    });
  });

  describe('isAuthorizedForContact', () => {
    let currentUser;
    let contact;

    beforeEach(() => {
      currentUser = {
        userId: '123',
      };
      contact = {
        contactId: currentUser.userId,
      };
    });

    it('returns false if the default value is false and the user is not authorized', () => {
      const result = isAuthorizedForContact({
        contact: {
          contactId: 'not_the_current_user',
        },
        currentUser,
        defaultValue: false,
        permission: ROLE_PERMISSIONS.VIEW_SEALED_CASE,
      });

      expect(result).toEqual(false);
    });

    it('returns true if the default value is true and the user is not authorized', () => {
      const result = isAuthorizedForContact({
        contact: {
          contactId: 'not_the_current_user',
        },
        currentUser,
        defaultValue: true,
        permission: ROLE_PERMISSIONS.VIEW_SEALED_CASE,
      });

      expect(result).toEqual(true);
    });

    it('returns true if the default value is false and the user is authorized', () => {
      const result = isAuthorizedForContact({
        contact,
        currentUser,
        defaultValue: false,
        permission: ROLE_PERMISSIONS.VIEW_SEALED_CASE,
      });

      expect(result).toEqual(true);
    });
  });
});
