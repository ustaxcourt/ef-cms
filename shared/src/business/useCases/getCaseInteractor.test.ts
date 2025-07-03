import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import {
  CASE_STATUS_TYPES,
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
import { getCaseInteractor } from './getCaseInteractor';
import { decorateForCaseStatus } from '@shared/business/entities/cases/CaseFactory';
import { getOtherFilers } from '../entities/cases/Case';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
  mockPetitionsClerkUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { RawPetitioner } from '@shared/business/entities/contacts/Petitioner';
import { UnauthorizedError } from '@web-api/errors/errors';
import { getWorkItemsByDocketNumber as getWorkItemsByDocketNumberMock } from '@web-api/persistence/postgres/workitems/getWorkItemsByDocketNumber';
import { WorkItem } from '@shared/business/entities/WorkItem';
import { docketClerk1User } from '@shared/test/mockUsers';

describe('getCaseInteractor', () => {
  const irsPractitionerId = '6cf19fba-18c6-467a-9ea6-7a14e42add2f';
  const practitionerId = '295c3640-7ff9-40bb-b2f1-8117bba084ea';
  const practitioner2Id = '42614976-4228-49aa-a4c3-597dae1c7220';
  const irsSuperuserId = '5a5c771d-ab63-4d78-a298-1de657dde621';
  const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
  const getWorkItemsByDocketNumber = jest.mocked(
    getWorkItemsByDocketNumberMock,
  );

  let testCase;
  let mockCaseContactPrimary;

  beforeEach(() => {
    testCase = { ...MOCK_CASE };
    mockCaseContactPrimary = testCase.petitioners[0];
  });

  it('should format the given docket number, removing leading zeroes and suffix', async () => {
    getCaseByDocketNumber.mockResolvedValue(testCase);

    await getCaseInteractor(
      applicationContext,
      {
        docketNumber: '000123-19S',
      },
      mockPetitionsClerkUser,
    );

    expect(getCaseByDocketNumber.mock.calls[0][0]).toEqual({
      applicationContext,
      docketNumber: '123-19',
      user: {
        email: 'mockPetitionsClerk@example.com',
        name: 'Patty Petitions Clerk',
        role: 'petitionsclerk',
        userId: 'd5234a80-64aa-4e3e-b0fd-59e6a835585e',
      },
    });
  });

  it('should throw an error when a case with the provided docketNumber is not found', async () => {
    getCaseByDocketNumber.mockResolvedValue(
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
      getCaseInteractor(
        applicationContext,
        {
          docketNumber: '123-19',
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('Case 123-19 was not found.');
    expect(getCaseByDocketNumber.mock.calls.length).toBe(1);
  });

  it('should return the case when the currentUser is an unassociated IRS practitioner', async () => {
    getCaseByDocketNumber.mockResolvedValue({
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

    const result = await getCaseInteractor(
      applicationContext,
      {
        docketNumber: '00101-00',
      },
      {
        email: 'access@example.com',
        name: 'IRS Practitionerr',
        role: ROLES.irsPractitioner,
        userId: irsPractitionerId,
      },
    );

    expect(result.docketNumber).toEqual('101-00');
  });

  it('should filter out docket entries that are not on the docket record when the currentUser is an external user associated with an unsealed case', async () => {
    const expectedDocketEntries = testCase.docketEntries.filter(
      de => de.isOnDocketRecord,
    );
    getCaseByDocketNumber.mockResolvedValue(testCase);

    const result = await getCaseInteractor(
      applicationContext,
      {
        docketNumber: testCase.docketNumber,
      },
      {
        email: mockCaseContactPrimary.email,
        name: mockCaseContactPrimary.name,
        role: ROLES.petitioner,
        userId: mockCaseContactPrimary.contactId,
      },
    );

    expect(result.docketEntries).toMatchObject(expectedDocketEntries);
  });

  it('should filter out docket entries that are not on the docket record when the currentUser is an external user associated with a sealed case', async () => {
    const expectedDocketEntries = testCase.docketEntries.filter(
      de => de.isOnDocketRecord,
    );
    getCaseByDocketNumber.mockResolvedValue({
      ...testCase,
      isSealed: true,
    });

    const result = await getCaseInteractor(
      applicationContext,
      {
        docketNumber: testCase.docketNumber,
      },
      {
        email: mockCaseContactPrimary.email,
        name: mockCaseContactPrimary.name,
        role: ROLES.petitioner,
        userId: mockCaseContactPrimary.contactId,
      },
    );

    expect(result.docketEntries).toMatchObject(expectedDocketEntries);
  });

  it('should return the case when the currentUser is an irs superuser even if the case has sealed documents', async () => {
    getCaseByDocketNumber.mockResolvedValue({
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

    const result = await getCaseInteractor(
      applicationContext,
      {
        docketNumber: '00101-00',
      },
      {
        email: 'superduper@example.com',
        name: 'IRS Superuser',
        role: ROLES.irsSuperuser,
        userId: irsSuperuserId,
      },
    );

    expect(result.docketEntries[1]).toMatchObject({
      docketEntryId: testCase.docketEntries[2].docketEntryId,
      documentType: 'Answer',
      eventCode: 'A',
    });
  });

  it('should return the case when the currentUser is the contactPrimary on the case', async () => {
    getCaseByDocketNumber.mockReturnValue(
      Promise.resolve({
        ...testCase,
        docketNumber: '101-00',
        petitioners: [
          {
            ...mockCaseContactPrimary,
            contactId: mockPetitionerUser.userId,
          },
        ],
        userId: '320fce0e-b050-4e04-8720-db25da3ca598',
      }),
    );

    const result = (await getCaseInteractor(
      applicationContext,
      {
        docketNumber: '00101-00',
      },
      mockPetitionerUser,
    )) as RawCase;

    expect(result.docketNumber).toEqual('101-00');
    expect(result.petitioners[0].address1).toBeDefined();
    expect(result.entityName).toEqual('Case');
  });

  it('should return the case when the currentUser is the contactSecondary on the case', async () => {
    getCaseByDocketNumber.mockResolvedValue({
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
          contactId: mockPetitionerUser.userId,
          contactType: CONTACT_TYPES.secondary,
        },
      ],
      userId: '320fce0e-b050-4e04-8720-db25da3ca598',
    });

    const result = (await getCaseInteractor(
      applicationContext,
      {
        docketNumber: '00101-00',
      },
      mockPetitionerUser,
    )) as RawCase;

    expect(result.docketNumber).toEqual('101-00');
    expect(result.petitioners[0].address1).toBeDefined();
    expect(result.entityName).toEqual('Case');
  });

  it('should return the full case (non public) when the user is part of the consolidated group', async () => {
    getCaseByDocketNumber.mockReturnValue({
      ...testCase,
      consolidatedCases: [
        { ...testCase, petitioners: [] },
        {
          ...testCase,
          petitioners: [
            {
              ...testCase.petitioners[0],
              contactId: mockPetitionerUser.userId,
            },
          ],
        },
        { ...testCase, petitioners: [] },
      ],
      leadDocketNumber: '101-20',
    });

    const result = await getCaseInteractor(
      applicationContext,
      {
        docketNumber: '101-18',
      },
      mockPetitionerUser,
    );

    expect(result.entityName).toEqual('Case');
  });

  it('should throw UnauthorizedError if user is not a valid AuthUser', async () => {
    const invalidUser = {
      email: 'someone@example.com',
      name: 'Some Body',
    };

    await expect(
      getCaseInteractor(
        applicationContext,
        {
          docketNumber: '123-45',
        },
        invalidUser as any,
      ),
    ).rejects.toThrow(UnauthorizedError);
  });

  it('should bubble up an error if getCaseByDocketNumber throws one', async () => {
    const mockError = new Error('DB error');
    getCaseByDocketNumber.mockRejectedValueOnce(mockError);

    await expect(
      getCaseInteractor(
        applicationContext,
        {
          docketNumber: '123-45',
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('DB error');
  });

  describe('sealed contact information', () => {
    beforeAll(() => {
      const mockCaseWithSealed = cloneDeep(MOCK_CASE_WITH_SECONDARY_OTHERS);
      // seal ALL addresses present on this mock case
      (mockCaseWithSealed.petitioners[0] as RawPetitioner).isAddressSealed =
        true;
      (mockCaseWithSealed.petitioners[1] as RawPetitioner).isAddressSealed =
        true;
      getOtherFilers(mockCaseWithSealed).forEach(
        filer => (filer.isAddressSealed = true),
      );

      getCaseByDocketNumber.mockReturnValue(mockCaseWithSealed);
    });

    it(`allows unfiltered view of sealed contact addresses when role is ${ROLES.docketClerk}`, async () => {
      const result = (await getCaseInteractor(
        applicationContext,
        {
          docketNumber: '101-18',
        },
        mockDocketClerkUser,
      )) as RawCase;

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
      const result = (await getCaseInteractor(
        applicationContext,
        {
          docketNumber: '101-18',
        },
        mockPrivatePractitionerUser,
      )) as RawCase;

      expect(result.petitioners[0].city).toBeUndefined();
      expect(result.petitioners[1].city).toBeUndefined();
    });
  });

  describe('sealed cases', () => {
    beforeAll(() => {
      getCaseByDocketNumber.mockReturnValue(
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

    it('should return a RestrictedCase entity when the current user is NOT authorized to view a sealed case and is NOT associated with the case', async () => {
      const result = await getCaseInteractor(
        applicationContext,
        {
          docketNumber: '101-18',
        },
        mockPrivatePractitionerUser,
      );

      expect(result).toEqual({
        docketEntries: [],
        docketNumber: '101-18',
        entityName: 'RestrictedCase',
        isSealed: true,
      });
    });

    it('should return a Case entity when the current user is authorized to view a sealed case and is NOT associated with the case', async () => {
      const result = (await getCaseInteractor(
        applicationContext,
        {
          docketNumber: '101-18',
        },
        mockDocketClerkUser,
      )) as RawCase;

      const contactPrimary = result.petitioners[0];
      expect(contactPrimary.address1).toBeDefined();
      expect(contactPrimary.phone).toBeDefined();
    });

    it('should return a Case entity when the current user is associated with a sealed case and NOT authorized to view it', async () => {
      const result = (await getCaseInteractor(
        applicationContext,
        {
          docketNumber: '101-18',
        },
        {
          email: 'noaccess@example.com',
          name: 'Katherine Pulaski',
          role: ROLES.privatePractitioner,
          userId: practitionerId,
        },
      )) as RawCase;

      const contactPrimary = result.petitioners[0];
      expect(contactPrimary.address1).toBeDefined();
      expect(contactPrimary.phone).toBeDefined();
    });
  });

  describe('cases that are NOT sealed', () => {
    beforeAll(() => {
      getCaseByDocketNumber.mockReturnValue(
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
      const result = (await getCaseInteractor(
        applicationContext,
        {
          docketNumber: '101-18',
        },
        mockDocketClerkUser,
      )) as RawCase;

      const contactPrimary = result.petitioners[0];
      expect(contactPrimary.address1).toBeDefined();
      expect(contactPrimary.phone).toBeDefined();
    });

    it('should return a PublicCase entity when the current user is an external user who is NOT associated with the case', async () => {
      const result = (await getCaseInteractor(
        applicationContext,
        {
          docketNumber: '101-18',
        },
        mockPrivatePractitionerUser,
      )) as any;

      const contactPrimary = result.petitioners[0];
      expect(contactPrimary.address1).toBeUndefined();
      expect(contactPrimary.phone).toBeUndefined();
      expect(result.canAllowDocumentService).toEqual(false);
    });

    it('should return a Case entity when the current user is associated with the case', async () => {
      const result = (await getCaseInteractor(
        applicationContext,
        {
          docketNumber: '101-18',
        },
        {
          email: 'accessgranted@example.com',
          name: 'Katherine Pulaski',
          role: ROLES.privatePractitioner,
          userId: practitioner2Id,
        },
      )) as RawCase;

      const contactPrimary = result.petitioners[0];
      expect(contactPrimary.address1).toBeDefined();
      expect(contactPrimary.phone).toBeDefined();
    });
  });

  describe('decorateForCaseStatus', () => {
    it('sets the canAllowDocumentService on the given case record', () => {
      const TEST_MOCK_CASE: RawCase = {
        ...MOCK_CASE,
      };

      expect(TEST_MOCK_CASE.canAllowDocumentService).not.toBeDefined();
      expect(
        decorateForCaseStatus(TEST_MOCK_CASE).canAllowDocumentService,
      ).toBeDefined();
    });

    it('should set "canDojPractitionersRepresentParty" when the case status is "On Appeal"', () => {
      const TEST_MOCK_CASE: RawCase = {
        ...MOCK_CASE,
        status: CASE_STATUS_TYPES.onAppeal,
      };

      expect(TEST_MOCK_CASE.canDojPractitionersRepresentParty).toBeUndefined();

      const DECORATED_CASE = decorateForCaseStatus(TEST_MOCK_CASE);
      expect(DECORATED_CASE.canDojPractitionersRepresentParty).toEqual(true);
    });
  });

  describe('docket entry work item info', () => {
    it('should attach work item info needed by the UI to the docket entries', async () => {
      const docketEntries = [
        {
          docketNumber: MOCK_CASE.docketNumber,
          docketEntryId: '0d9119cb-c6f9-4fc0-8986-def8373b93ca',
        },
        {
          docketNumber: MOCK_CASE.docketNumber,
          docketEntryId: '83c4b4eb-6b31-4bf6-a178-79544c50d12b',
        },
        {
          docketNumber: MOCK_CASE.docketNumber,
          docketEntryId: '93421496-c7c4-4c7e-9baa-32c0a7e26879',
        },
        {
          docketNumber: MOCK_CASE.docketNumber,
          docketEntryId: '8193d2af-6b67-4d14-96bc-0200d7e9f62e',
        },
      ];

      getCaseByDocketNumber.mockResolvedValueOnce({
        ...MOCK_CASE,
        docketEntries,
      });

      const workItems = [
        {
          docketNumber: MOCK_CASE.docketNumber,
          docketEntryId: docketEntries[0].docketEntryId,
          workItemId: '1d9119cb-c6f9-4fc0-8986-def8373b93ca',
        },
        {
          docketNumber: MOCK_CASE.docketNumber,
          docketEntryId: docketEntries[1].docketEntryId,
          workItemId: '2d9119cb-c6f9-4fc0-8986-def8373b93ca',
          isRead: false,
        },
        {
          docketNumber: MOCK_CASE.docketNumber,
          docketEntryId: docketEntries[2].docketEntryId,
          workItemId: '3d9119cb-c6f9-4fc0-8986-def8373b93ca',
          isRead: true,
        },
        {
          docketNumber: MOCK_CASE.docketNumber,
          docketEntryId: docketEntries[3].docketEntryId,
          workItemId: '3d9119cb-c6f9-4fc0-8986-def8373b93ca',
          isRead: true,
          completedAt: '2019-09-19T16:42:00.000Z',
        },
      ];

      getWorkItemsByDocketNumber.mockResolvedValueOnce(workItems as WorkItem[]);
      const result = (await getCaseInteractor(
        applicationContext,
        {
          docketNumber: MOCK_CASE.docketNumber,
        },
        {
          email: docketClerk1User.email!,
          name: docketClerk1User.name,
          role: ROLES.docketClerk,
          userId: docketClerk1User.userId,
        },
      )) as RawCase;
      for (let i = 0; i < docketEntries.length; i++) {
        expect(result.docketEntries[i]).toMatchObject({
          workItemId: workItems[i].workItemId,
          qcViewed: !!workItems[i].isRead,
          qcComplete: !!workItems[i].completedAt,
        });
      }
    });
  });
});
