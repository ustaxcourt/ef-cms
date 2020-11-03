const {
  CASE_TYPES_MAP,
  PARTY_TYPES,
  ROLES,
} = require('../entities/EntityConstants');
const {
  MOCK_CASE,
  MOCK_CASE_WITH_SECONDARY_OTHERS,
} = require('../../test/mockCase');
const { applicationContext } = require('../test/createTestApplicationContext');
const { getCaseInteractor } = require('./getCaseInteractor');
const { docketEntries } = MOCK_CASE;
const { cloneDeep } = require('lodash');

describe('getCaseInteractor', () => {
  const petitionsclerkId = '23c4d382-1136-492f-b1f4-45e893c34771';
  const docketClerkId = '44c4d382-1136-492f-b1f4-45e893c34771';
  const petitionerId = '273f5d19-3707-41c0-bccc-449c52dfe54e';
  const irsPractitionerId = '6cf19fba-18c6-467a-9ea6-7a14e42add2f';
  const practitionerId = '295c3640-7ff9-40bb-b2f1-8117bba084ea';
  const practitioner2Id = '42614976-4228-49aa-a4c3-597dae1c7220';

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
      getCaseInteractor({
        applicationContext,
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
      getCaseInteractor({
        applicationContext,
        docketNumber: '00101-08',
      }),
    ).rejects.toThrow('The Case entity was invalid');
  });

  it('successfully retrieves a case with docketEntries that have documentContents', async () => {
    const mockCaseWithDocumentContents = {
      ...MOCK_CASE,
      docketEntries: [
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketEntryId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          docketNumber: '101-18',
          documentContentsId: '0098d177-78ef-4210-88aa-4bbb45c4f048',
          documentTitle: 'Petition',
          documentType: 'Petition',
          draftOrderState: {},
          eventCode: 'P',
          filedBy: 'Test Petitioner',
          processingStatus: 'pending',
          userId: petitionerId,
        },
      ],
    };
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: petitionsclerkId,
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCaseWithDocumentContents);
    applicationContext.getPersistenceGateway().getDocument.mockReturnValue(
      Buffer.from(
        JSON.stringify({
          documentContents: 'the contents!',
          richText: '<b>the contents!</b>',
        }),
      ),
    );

    const caseRecord = await getCaseInteractor({
      applicationContext,
      docketNumber: '123-19',
    });

    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).toHaveBeenCalledWith({
      applicationContext,
      key: '0098d177-78ef-4210-88aa-4bbb45c4f048',
      protocol: 'S3',
      useTempBucket: false,
    });
    expect(caseRecord.docketEntries[0]).toMatchObject({
      documentContents: 'the contents!',
      draftOrderState: {
        documentContents: 'the contents!',
        richText: '<b>the contents!</b>',
      },
    });
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
          contactPrimary: {
            ...MOCK_CASE.contactPrimary,
            contactId: 'dc56e26e-f9fd-4165-8997-97676cc0523e',
          },
          docketNumber: '101-00',
          userId: '320fce0e-b050-4e04-8720-db25da3ca598',
        }),
      );

    const result = await getCaseInteractor({
      applicationContext,
      docketNumber: '00101-00',
    });

    expect(result.docketNumber).toEqual('101-00');
  });

  it('should return the case when the currentUser is the contactSecondary on the case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      userId: '754a3191-884f-42f0-ad2c-e6c706685299',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve({
          ...MOCK_CASE,
          contactPrimary: {
            ...MOCK_CASE.contactPrimary,
            contactId: '0898d5c3-2948-4924-b28b-d5c1451c80de',
          },
          contactSecondary: {
            ...MOCK_CASE.contactPrimary,
            contactId: '754a3191-884f-42f0-ad2c-e6c706685299',
          },
          docketNumber: '101-00',
          partyType: PARTY_TYPES.petitionerSpouse,
          userId: '320fce0e-b050-4e04-8720-db25da3ca598',
        }),
      );

    const result = await getCaseInteractor({
      applicationContext,
      docketNumber: '00101-00',
    });

    expect(result.docketNumber).toEqual('101-00');
  });

  describe('sealed contact information', () => {
    beforeAll(() => {
      const mockCaseWithSealed = cloneDeep(MOCK_CASE_WITH_SECONDARY_OTHERS);
      // seal ALL addresses present on this mock case
      mockCaseWithSealed.contactPrimary.isAddressSealed = true;
      mockCaseWithSealed.contactSecondary.isAddressSealed = true;
      mockCaseWithSealed.otherFilers.forEach(
        filer => (filer.isAddressSealed = true),
      );
      mockCaseWithSealed.otherPetitioners.forEach(
        filer => (filer.isAddressSealed = true),
      );
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(mockCaseWithSealed);
    });

    it(`allows unfiltered view of sealed contact addresses when role is ${ROLES.docket_clerk}`, async () => {
      applicationContext.getCurrentUser.mockReturnValue({
        name: 'Security Officer Worf',
        role: ROLES.docketClerk,
        userId: docketClerkId,
      });
      const result = await getCaseInteractor({
        applicationContext,
        docketNumber: '101-18',
      });
      expect(result.contactPrimary.city).toBeDefined();
      expect(result.contactPrimary.sealedAndUnavailable).toBe(false);
      expect(result.contactSecondary.city).toBeDefined();
      expect(result.contactSecondary.sealedAndUnavailable).toBe(false);
      result.otherFilers.forEach(filer => {
        expect(filer.city).toBeDefined();
        expect(filer.sealedAndUnavailable).toBe(false);
      });
      result.otherPetitioners.forEach(filer => {
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

      const result = await getCaseInteractor({
        applicationContext,
        docketNumber: '101-18',
      });

      expect(result.contactPrimary.city).toBeUndefined();
      expect(result.contactSecondary.city).toBeUndefined();
    });
  });

  describe('sealed cases', () => {
    beforeAll(() => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(
          Promise.resolve({
            ...MOCK_CASE,
            caseCaption: 'a case caption',
            caseType: CASE_TYPES_MAP.other,
            createdAt: new Date().toISOString(),
            docketEntries,
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
            sealedDate: new Date().toISOString(),
          }),
        );
    });

    it('should return a PublicCase entity when the current user is NOT authorized to view a sealed case and is NOT associated with the case', async () => {
      applicationContext.getCurrentUser.mockReturnValue({
        name: 'Tasha Yar',
        role: ROLES.privatePractitioner,
        userId: practitioner2Id,
      });

      const result = await getCaseInteractor({
        applicationContext,
        docketNumber: '101-18',
      });

      expect(result).toEqual({
        caseCaption: undefined,
        contactPrimary: undefined,
        contactSecondary: undefined,
        docketEntries: [],
        docketNumber: '101-18',
        docketNumberSuffix: undefined,
        docketNumberWithSuffix: '101-18',
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

      const result = await getCaseInteractor({
        applicationContext,
        docketNumber: '101-18',
      });

      expect(result.contactPrimary.address1).toBeDefined();
      expect(result.contactPrimary.phone).toBeDefined();
    });

    it('should return a Case entity when the current user is associated with a sealed case and NOT authorized to view it', async () => {
      applicationContext.getCurrentUser.mockReturnValue({
        name: 'Tasha Yar',
        role: ROLES.privatePractitioner,
        userId: practitionerId,
      });

      const result = await getCaseInteractor({
        applicationContext,
        docketNumber: '101-18',
      });

      expect(result.contactPrimary.address1).toBeDefined();
      expect(result.contactPrimary.phone).toBeDefined();
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

      const result = await getCaseInteractor({
        applicationContext,
        docketNumber: '101-18',
      });

      expect(result.contactPrimary.address1).toBeDefined();
      expect(result.contactPrimary.phone).toBeDefined();
    });

    it('should return a PublicCase entity when the current user is an external user who is NOT associated with the case', async () => {
      applicationContext.getCurrentUser.mockReturnValue({
        name: 'Tasha Yar',
        role: ROLES.privatePractitioner,
        userId: practitionerId,
      });

      const result = await getCaseInteractor({
        applicationContext,
        docketNumber: '101-18',
      });

      expect(result.contactPrimary.address1).toBeUndefined();
      expect(result.contactPrimary.phone).toBeUndefined();
    });

    it('should return a Case entity when the current user is associated with the case', async () => {
      applicationContext.getCurrentUser.mockReturnValue({
        name: 'Tasha Yar',
        role: ROLES.privatePractitioner,
        userId: practitioner2Id,
      });

      const result = await getCaseInteractor({
        applicationContext,
        docketNumber: '101-18',
      });

      expect(result.contactPrimary.address1).toBeDefined();
      expect(result.contactPrimary.phone).toBeDefined();
    });
  });
});
