import {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  PARTY_TYPES,
  ROLES,
} from '../entities/EntityConstants';
import {
  MOCK_CASE,
  MOCK_CASE_WITH_SECONDARY_OTHERS,
} from '../../test/mockCase';
import { applicationContext } from '../test/createTestApplicationContext';
import { cloneDeep } from 'lodash';
import { decorateForCaseStatus, getCaseInteractor } from './getCaseInteractor';
import { getOtherFilers } from '../entities/cases/Case';

describe('getCaseInteractor', () => {
  const petitionsclerkId = '23c4d382-1136-492f-b1f4-45e893c34771';
  const docketClerkId = '44c4d382-1136-492f-b1f4-45e893c34771';
  const irsPractitionerId = '6cf19fba-18c6-467a-9ea6-7a14e42add2f';
  const practitionerId = '295c3640-7ff9-40bb-b2f1-8117bba084ea';
  const practitioner2Id = '42614976-4228-49aa-a4c3-597dae1c7220';
  const petitionerId = '42624376-4228-49aa-a4c3-597dae1c7220';
  const irsSuperuserId = '5a5c771d-ab63-4d78-a298-1de657dde621';

  let testCase;
  let mockCaseContactPrimary;

  beforeEach(() => {
    testCase = { ...MOCK_CASE };
    mockCaseContactPrimary = testCase.petitioners[0];
  });

  it('should format the given docket number, removing leading zeroes and suffix', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(testCase);

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
    const mockInvalidCase = { ...testCase, caseCaption: undefined };
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
        ...testCase,
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

  it('should return the case when the currentUser is an irs superuser even if the case has sealed documents', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'IRS Superuser',
      role: ROLES.irsSuperuser,
      userId: irsSuperuserId,
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue({
        ...testCase,
        docketEntries: [
          testCase.docketEntries[0],
          testCase.docketEntries[1],
          {
            ...testCase.docketEntries[2],
            isOnDocketRecord: true,
            isSealed: true,
            sealedTo: 'Public',
          },
        ],
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

    expect(result.docketEntries[1]).toMatchObject({
      docketEntryId: testCase.docketEntries[2].docketEntryId,
      documentType: 'Answer',
      eventCode: 'A',
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
          ...testCase,
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
        ...testCase,
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

  it('should return the full case (non public) when the user is part of the consolidated group', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Tasha Yar',
      role: ROLES.petitioner,
      userId: petitionerId,
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        ...testCase,
        consolidatedCases: [
          { ...testCase, petitioners: [] },
          {
            ...testCase,
            petitioners: [
              {
                ...testCase.petitioners[0],
                contactId: petitionerId,
              },
            ],
          },
          { ...testCase, petitioners: [] },
        ],
        leadDocketNumber: '101-20',
      });

    const result = await getCaseInteractor(applicationContext, {
      docketNumber: '101-18',
    });
    expect(result.entityName).toEqual('Case');
  });

  describe('sealed contact information', () => {
    beforeAll(() => {
      const mockCaseWithSealed = cloneDeep(MOCK_CASE_WITH_SECONDARY_OTHERS);
      // seal ALL addresses present on this mock case
      mockCaseWithSealed.petitioners[0].isAddressSealed = true;
      mockCaseWithSealed.petitioners[1].isAddressSealed = true;
      getOtherFilers(mockCaseWithSealed).forEach(
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

      const contactPrimary = result.petitioners[0];
      const contactSecondary = result.petitioners[1];
      expect(contactPrimary.city).toBeDefined();
      expect(contactPrimary.sealedAndUnavailable).toBe(false);
      expect(contactSecondary.city).toBeDefined();
      expect(contactSecondary.sealedAndUnavailable).toBe(false);
      getOtherFilers(result).forEach(filer => {
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

      expect(result.petitioners[0].city).toBeUndefined();
      expect(result.petitioners[1].city).toBeUndefined();
    });
  });

  describe('sealed cases', () => {
    beforeAll(() => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(
          Promise.resolve({
            ...testCase,
            caseCaption: 'a case caption',
            caseType: CASE_TYPES_MAP.other,
            createdAt: applicationContext.getUtilities().createISODateString(),
            docketNumber: '101-18',
            irsPractitioners: [
              {
                barNumber: 'BN1234',
                name: 'Wesley Crusher',
                role: ROLES.irsPractitioner,
                userId: irsPractitionerId,
              },
            ],
            isSealed: true,
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
            sealedDate: '2019-09-19T16:42:00.000Z',
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
        canAllowDocumentService: undefined,
        canAllowPrintableDocketRecord: undefined,
        caseCaption: undefined,
        docketEntries: [],
        docketNumber: '101-18',
        docketNumberSuffix: undefined,
        docketNumberWithSuffix: '101-18',
        entityName: 'PublicCase',
        hasIrsPractitioner: false,
        isPaper: undefined,
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

      const contactPrimary = result.petitioners[0];
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

      const contactPrimary = result.petitioners[0];
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
            ...testCase,
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

      const contactPrimary = result.petitioners[0];
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

      const contactPrimary = result.petitioners[0];
      expect(contactPrimary.address1).toBeUndefined();
      expect(contactPrimary.phone).toBeUndefined();
      expect(result.canAllowDocumentService).toEqual(false);
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

      const contactPrimary = result.petitioners[0];
      expect(contactPrimary.address1).toBeDefined();
      expect(contactPrimary.phone).toBeDefined();
    });
  });

  describe('decorateForCaseStatus', () => {
    it('sets the canAllowDocumentService on the given case record', () => {
      expect(MOCK_CASE.canAllowDocumentService).not.toBeDefined();
      expect(
        decorateForCaseStatus(MOCK_CASE).canAllowDocumentService,
      ).toBeDefined();
    });
  });
});
