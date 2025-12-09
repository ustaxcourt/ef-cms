/* eslint-disable max-lines */
import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/docketEntries/mocks.jest';
import '@web-api/persistence/postgres/users/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import {
  CONTACT_CHANGE_DOCUMENT_TYPES,
  DOCKET_SECTION,
} from '@shared/business/entities/EntityConstants';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { completeDocketEntryQCInteractor } from './completeDocketEntryQCInteractor';
import { docketClerkUser } from '@shared/test/mockUsers';
import { DbUser } from '@web-api/persistence/postgres/users/mapper';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getDocketEntriesByDocketNumberAndDocketEntryId as getDocketEntriesByDocketNumberAndDocketEntryIdMock } from '@web-api/persistence/postgres/docketEntries/getDocketEntriesByDocketNumberAndDocketEntryId';
import { getFeatureFlagValues as getFeatureFlagValuesMock } from '@web-api/persistence/postgres/featureFlag/getFeatureFlagValues';
import { getUserById as getUserByIdMock } from '@web-api/persistence/postgres/users/getUserById';
import { getWorkItemByDocketNumberAndDocketEntryId as getWorkItemByDocketNumberAndDocketEntryIdMock } from '@web-api/persistence/postgres/workitems/getWorkItemByDocketNumberAndDocketEntryId';
import {
  mockDocketClerkUser,
  mockPetitionerUser,
} from '@shared/test/mockAuthUsers';
import { MOCK_CASE } from '@shared/test/mockCase';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { WorkItem } from '@shared/business/entities/WorkItem';

const getCaseByDocketNumber = getCaseByDocketNumberMock as jest.Mock;
const getWorkItemByDocketNumberAndDocketEntryId = jest.mocked(
  getWorkItemByDocketNumberAndDocketEntryIdMock,
);
const getUserById = jest.mocked(getUserByIdMock);
const getFeatureFlagValues = jest.mocked(getFeatureFlagValuesMock);
const getDocketEntriesByDocketNumberAndDocketEntryId = jest.mocked(
  getDocketEntriesByDocketNumberAndDocketEntryIdMock,
);
const updateCaseAndAssociations = jest
  .mocked(updateCaseAndAssociationsMock)
  .mockImplementation(({ caseToUpdate }) => Promise.resolve(caseToUpdate));

describe('completeDocketEntryQCInteractor - Updated Coverage', () => {
  let caseRecord: any;
  const mockDocketEntryId = MOCK_CASE.docketEntries[0].docketEntryId;
  const mockPdfUrl = 'www.example.com';

  beforeEach(() => {
    getFeatureFlagValues.mockResolvedValue([
      {
        name: 'clerk-of-court-configuration',
        value: { current: { name: 'bob', title: 'clerk of court' } },
      },
    ]);

    const workItem = {
      docketEntryId: mockDocketEntryId,
      docketNumber: '45678-18',
      section: DOCKET_SECTION,
      sentBy: 'Test User',
      sentByUserId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      updatedAt: applicationContext.getUtilities().createISODateString(),
      workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    getWorkItemByDocketNumberAndDocketEntryId.mockResolvedValue(
      new WorkItem(workItem),
    );
    getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([]);

    caseRecord = {
      ...MOCK_CASE,
      docketEntries: [
        {
          ...MOCK_CASE.docketEntries[0],
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          index: 1,
          isOnDocketRecord: true,
          receivedAt: '2019-08-25T05:00:00.000Z',
        },
      ],
    };

    getUserById.mockResolvedValue(docketClerkUser as DbUser);
    getCaseByDocketNumber.mockResolvedValue(caseRecord);

    applicationContext.getChromiumBrowser().newPage.mockReturnValue({
      addStyleTag: () => {},
      pdf: () => 'Hello World',
      setContent: () => {},
    });

    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue({ url: mockPdfUrl });
    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockResolvedValue({
        pdfUrl: mockPdfUrl,
      });
  });

  describe('Authorization & Validation', () => {
    it('should throw error if not authorized', async () => {
      await expect(
        completeDocketEntryQCInteractor(
          applicationContext,
          {
            entryMetadata: { ...caseRecord.docketEntries[0] },
          },
          mockPetitionerUser,
        ),
      ).rejects.toThrow('Unauthorized');
    });

    it('should throw error when user not found', async () => {
      getUserById.mockResolvedValueOnce(undefined);
      await expect(
        completeDocketEntryQCInteractor(
          applicationContext,
          {
            entryMetadata: { ...caseRecord.docketEntries[0] },
          },
          mockDocketClerkUser,
        ),
      ).rejects.toThrow('User not found with user id');
    });

    it('should throw error when work item not found', async () => {
      getWorkItemByDocketNumberAndDocketEntryId.mockResolvedValueOnce(
        undefined,
      );
      await expect(
        completeDocketEntryQCInteractor(
          applicationContext,
          {
            entryMetadata: { ...caseRecord.docketEntries[0] },
          },
          mockDocketClerkUser,
        ),
      ).rejects.toThrow('Could not find work item associated with');
    });

    it('should throw error when docket entry not found', async () => {
      getCaseByDocketNumber.mockResolvedValueOnce({
        ...caseRecord,
        docketEntries: [],
      });
      await expect(
        completeDocketEntryQCInteractor(
          applicationContext,
          {
            entryMetadata: { ...caseRecord.docketEntries[0] },
          },
          mockDocketClerkUser,
        ),
      ).rejects.toThrow('Could not find docket entry with id');
    });

    it('should throw error when work item already completed', async () => {
      const completedWorkItem = new WorkItem({
        completedAt: '2023-01-01T00:00:00.000Z',
        completedBy: 'Test User',
        completedByUserId: 'test-user-id',
        completedMessage: 'Completed',
        docketEntryId: mockDocketEntryId,
        docketNumber: '45678-18',
        section: DOCKET_SECTION,
        sentBy: 'Test User',
        sentByUserId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        updatedAt: applicationContext.getUtilities().createISODateString(),
        workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      });
      getWorkItemByDocketNumberAndDocketEntryId.mockResolvedValueOnce(
        completedWorkItem,
      );
      await expect(
        completeDocketEntryQCInteractor(
          applicationContext,
          {
            entryMetadata: { ...caseRecord.docketEntries[0] },
          },
          mockDocketClerkUser,
        ),
      ).rejects.toThrow('The work item was already completed');
    });
  });

  describe('Basic QC Completion', () => {
    it('should successfully complete QC', async () => {
      const result = await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: {
            ...caseRecord.docketEntries[0],
            certificateOfService: true,
            certificateOfServiceDate: '2019-08-25T05:00:00.000Z',
          },
        },
        mockDocketClerkUser,
      );
      expect(result.caseDetail).toBeDefined();
      expect(getCaseByDocketNumber).toHaveBeenCalled();
      expect(updateCaseAndAssociations).toHaveBeenCalled();
    });

    it('should update all editable fields', async () => {
      const result = await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: {
            ...caseRecord.docketEntries[0],
            addToCoversheet: true,
            additionalInfo: 'Info',
            attachments: true,
            certificateOfService: true,
            certificateOfServiceDate: '2019-08-25T05:00:00.000Z',
            filers: [caseRecord.petitioners[0].contactId],
            lodged: true,
            pending: true,
          },
        },
        mockDocketClerkUser,
      );
      expect(result).toBeDefined();
    });
  });

  describe('Coversheet Generation', () => {
    it('should add coversheet when receivedAt changes', async () => {
      caseRecord.docketEntries[0].receivedAt = '2024-01-01';
      await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: {
            ...caseRecord.docketEntries[0],
            receivedAt: '2024-01-02',
          },
        },
        mockDocketClerkUser,
      );
      expect(
        applicationContext.getUseCases().addCoversheetInteractor,
      ).toHaveBeenCalled();
    });

    it('should add coversheet when certificateOfService changes', async () => {
      caseRecord.docketEntries[0].certificateOfService = false;
      await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: {
            ...caseRecord.docketEntries[0],
            certificateOfService: true,
            certificateOfServiceDate: '2019-08-25T05:00:00.000Z',
          },
        },
        mockDocketClerkUser,
      );
      expect(
        applicationContext.getUseCases().addCoversheetInteractor,
      ).toHaveBeenCalled();
    });

    it('should add coversheet when title changes', async () => {
      caseRecord.docketEntries[0].documentTitle = 'Original';
      caseRecord.docketEntries[0].documentType = 'Original';
      await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: {
            ...caseRecord.docketEntries[0],
            documentTitle: 'Answer',
            documentType: 'Answer',
          },
        },
        mockDocketClerkUser,
      );
      expect(
        applicationContext.getUseCases().addCoversheetInteractor,
      ).toHaveBeenCalled();
    });
  });

  describe('Notice of Docket Change', () => {
    it('should generate notice when filedBy changes', async () => {
      caseRecord.docketEntries[0].filedBy = 'Original';
      await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: { ...caseRecord.docketEntries[0], filedBy: 'New' },
        },
        mockDocketClerkUser,
      );
      expect(
        applicationContext.getUseCaseHelpers()
          .serveDocumentAndGetPaperServicePdf,
      ).toHaveBeenCalled();
    });

    it('should generate notice when documentTitle changes', async () => {
      caseRecord.docketEntries[0].documentTitle = 'Original';
      await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: {
            ...caseRecord.docketEntries[0],
            documentTitle: 'Changed',
          },
        },
        mockDocketClerkUser,
      );
      expect(
        applicationContext.getUseCaseHelpers()
          .serveDocumentAndGetPaperServicePdf,
      ).toHaveBeenCalled();
    });

    it('should not generate notice when nothing changes', async () => {
      applicationContext
        .getUseCaseHelpers()
        .serveDocumentAndGetPaperServicePdf.mockClear();
      await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: { ...caseRecord.docketEntries[0] },
        },
        mockDocketClerkUser,
      );
      expect(
        applicationContext.getUseCaseHelpers()
          .serveDocumentAndGetPaperServicePdf,
      ).not.toHaveBeenCalled();
    });
  });

  describe('Contact Change Documents', () => {
    it('should handle contact change documents', async () => {
      caseRecord.docketEntries[0].documentType =
        CONTACT_CHANGE_DOCUMENT_TYPES[0];
      caseRecord.petitioners[0].serviceIndicator = 'Paper';
      await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: { ...caseRecord.docketEntries[0] },
        },
        mockDocketClerkUser,
      );
      expect(
        applicationContext.getPersistenceGateway().getDocument,
      ).toHaveBeenCalled();
    });

    it('should handle override paper service address', async () => {
      await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: {
            ...caseRecord.docketEntries[0],
            overridePaperServiceAddress: true,
          },
        },
        mockDocketClerkUser,
      );
      expect(
        applicationContext.getPersistenceGateway().getDocument,
      ).toHaveBeenCalled();
    });
  });

  describe('Multi-docketed Cases', () => {
    it('should throw error if QC on non-lead case', async () => {
      caseRecord.leadDocketNumber = '101-20';
      caseRecord.docketNumber = '102-20';
      getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([
        { ...MOCK_CASE.docketEntries[0], docketNumber: '101-20' },
        { ...MOCK_CASE.docketEntries[0], docketNumber: '102-20' },
      ]);
      await expect(
        completeDocketEntryQCInteractor(
          applicationContext,
          {
            entryMetadata: { ...caseRecord.docketEntries[0] },
          },
          mockDocketClerkUser,
        ),
      ).rejects.toThrow(
        'QC for multidocketed documents must be completed on the lead case',
      );
    });

    it('should process member cases on lead case', async () => {
      const memberCase = {
        ...MOCK_CASE,
        docketNumber: '102-20',
        docketEntries: [
          { ...MOCK_CASE.docketEntries[0], docketNumber: '102-20' },
        ],
      };
      caseRecord.leadDocketNumber = MOCK_CASE.docketNumber;
      caseRecord.consolidatedCases = [{ docketNumber: '102-20' }];

      getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([
        {
          ...MOCK_CASE.docketEntries[0],
          docketNumber: MOCK_CASE.docketNumber,
          filedBy: 'Test',
        },
        {
          ...MOCK_CASE.docketEntries[0],
          docketNumber: '102-20',
          filedBy: 'Test',
        },
      ]);

      getCaseByDocketNumber.mockImplementation((args: any) => {
        return args.docketNumber === '102-20'
          ? Promise.resolve(memberCase)
          : Promise.resolve(caseRecord);
      });

      const memberWorkItem = new WorkItem({
        docketEntryId: mockDocketEntryId,
        docketNumber: '102-20',
        section: DOCKET_SECTION,
        sentBy: 'Test',
        sentByUserId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        updatedAt: applicationContext.getUtilities().createISODateString(),
        workItemId: 'd54ba5a9-b37b-479d-9201-067ec6e335bb',
      });

      getWorkItemByDocketNumberAndDocketEntryId.mockImplementation(
        (args: any) => {
          return args.docketNumber === '102-20'
            ? Promise.resolve(memberWorkItem)
            : Promise.resolve(
                new WorkItem({
                  docketEntryId: mockDocketEntryId,
                  docketNumber: MOCK_CASE.docketNumber,
                  section: DOCKET_SECTION,
                  sentBy: 'Test',
                  sentByUserId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
                  updatedAt: applicationContext
                    .getUtilities()
                    .createISODateString(),
                  workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
                }),
              );
        },
      );

      await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: { ...caseRecord.docketEntries[0], filedBy: 'Updated' },
        },
        mockDocketClerkUser,
      );

      expect(getCaseByDocketNumber).toHaveBeenCalledWith({
        docketNumber: '102-20',
      });
    });

    it('should handle member case errors', async () => {
      caseRecord.leadDocketNumber = MOCK_CASE.docketNumber;
      caseRecord.consolidatedCases = [{ docketNumber: '102-20' }];
      getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([
        {
          ...MOCK_CASE.docketEntries[0],
          docketNumber: MOCK_CASE.docketNumber,
          filedBy: 'Orig',
        },
        {
          ...MOCK_CASE.docketEntries[0],
          docketNumber: '102-20',
          filedBy: 'Orig',
        },
      ]);
      getCaseByDocketNumber.mockImplementation((args: any) => {
        return args.docketNumber === '102-20'
          ? Promise.reject(new Error('error'))
          : Promise.resolve(caseRecord);
      });
      await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: { ...caseRecord.docketEntries[0], filedBy: 'New' },
        },
        mockDocketClerkUser,
      );
      expect(applicationContext.logger?.error).toHaveBeenCalled();
    });

    it('should skip member case with no work item', async () => {
      caseRecord.leadDocketNumber = MOCK_CASE.docketNumber;
      caseRecord.consolidatedCases = [{ docketNumber: '102-20' }];
      const memberCase = {
        ...MOCK_CASE,
        docketNumber: '102-20',
        docketEntries: [{ ...MOCK_CASE.docketEntries[0] }],
      };
      getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([
        { ...MOCK_CASE.docketEntries[0], docketNumber: MOCK_CASE.docketNumber },
        { ...MOCK_CASE.docketEntries[0], docketNumber: '102-20' },
      ]);
      getCaseByDocketNumber.mockImplementation((args: any) => {
        return args.docketNumber === '102-20'
          ? Promise.resolve(memberCase)
          : Promise.resolve(caseRecord);
      });
      getWorkItemByDocketNumberAndDocketEntryId.mockImplementation(
        (args: any) => {
          return args.docketNumber === '102-20'
            ? Promise.resolve(undefined)
            : Promise.resolve(
                new WorkItem({
                  docketEntryId: mockDocketEntryId,
                  docketNumber: MOCK_CASE.docketNumber,
                  section: DOCKET_SECTION,
                  sentBy: 'Test',
                  sentByUserId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
                  updatedAt: applicationContext
                    .getUtilities()
                    .createISODateString(),
                  workItemId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
                }),
              );
        },
      );
      await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: { ...caseRecord.docketEntries[0] },
        },
        mockDocketClerkUser,
      );
      expect(updateCaseAndAssociations).toHaveBeenCalled();
    });
  });

  describe('Multi-docketed NODC', () => {
    it('should generate case-specific NODCs', async () => {
      const memberCase = {
        ...MOCK_CASE,
        docketNumber: '102-20',
        docketEntries: [{ ...MOCK_CASE.docketEntries[0], filedBy: 'Orig' }],
        petitioners: [
          { ...MOCK_CASE.petitioners[0], serviceIndicator: 'Paper' },
        ],
      };
      caseRecord.leadDocketNumber = MOCK_CASE.docketNumber;
      caseRecord.consolidatedCases = [{ docketNumber: '102-20' }];
      caseRecord.docketEntries[0].filedBy = 'Orig';
      getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([
        {
          ...MOCK_CASE.docketEntries[0],
          docketNumber: MOCK_CASE.docketNumber,
          filedBy: 'Orig',
        },
        {
          ...MOCK_CASE.docketEntries[0],
          docketNumber: '102-20',
          filedBy: 'Orig',
        },
      ]);
      getCaseByDocketNumber.mockImplementation((args: any) => {
        return args.docketNumber === '102-20'
          ? Promise.resolve(memberCase)
          : Promise.resolve(caseRecord);
      });
      await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: { ...caseRecord.docketEntries[0], filedBy: 'New' },
        },
        mockDocketClerkUser,
      );
      expect(
        applicationContext.getUseCaseHelpers()
          .serveDocumentAndGetPaperServicePdf,
      ).toHaveBeenCalled();
    });

    it('should skip NODC when no changes', async () => {
      const memberCase = {
        ...MOCK_CASE,
        docketNumber: '102-20',
        docketEntries: [{ ...MOCK_CASE.docketEntries[0], filedBy: 'Test' }],
      };
      caseRecord.leadDocketNumber = MOCK_CASE.docketNumber;
      caseRecord.consolidatedCases = [{ docketNumber: '102-20' }];
      getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([
        {
          ...MOCK_CASE.docketEntries[0],
          docketNumber: MOCK_CASE.docketNumber,
          filedBy: 'Test',
        },
        {
          ...MOCK_CASE.docketEntries[0],
          docketNumber: '102-20',
          filedBy: 'Test',
        },
      ]);
      getCaseByDocketNumber.mockImplementation((args: any) => {
        return args.docketNumber === '102-20'
          ? Promise.resolve(memberCase)
          : Promise.resolve(caseRecord);
      });
      await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: { ...caseRecord.docketEntries[0] },
        },
        mockDocketClerkUser,
      );
      expect(
        applicationContext.getUseCaseHelpers().countPagesInDocument,
      ).not.toHaveBeenCalled();
    });

    it('should handle NODC errors', async () => {
      caseRecord.leadDocketNumber = MOCK_CASE.docketNumber;
      caseRecord.consolidatedCases = [{ docketNumber: '102-20' }];
      getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([
        {
          ...MOCK_CASE.docketEntries[0],
          docketNumber: MOCK_CASE.docketNumber,
          filedBy: 'Orig',
        },
        {
          ...MOCK_CASE.docketEntries[0],
          docketNumber: '102-20',
          filedBy: 'Orig',
        },
      ]);
      getCaseByDocketNumber.mockImplementation((args: any) => {
        return args.docketNumber === '102-20'
          ? Promise.reject(new Error('NODC error'))
          : Promise.resolve(caseRecord);
      });
      await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: { ...caseRecord.docketEntries[0], filedBy: 'New' },
        },
        mockDocketClerkUser,
      );
      expect(applicationContext.logger?.error).toHaveBeenCalled();
    });

    it('should aggregate paper parties', async () => {
      const memberCase = {
        ...MOCK_CASE,
        docketNumber: '102-20',
        petitioners: [
          { ...MOCK_CASE.petitioners[0], serviceIndicator: 'Paper' },
        ],
      };
      caseRecord.leadDocketNumber = MOCK_CASE.docketNumber;
      caseRecord.consolidatedCases = [{ docketNumber: '102-20' }];
      caseRecord.docketEntries[0].filedBy = 'Orig';
      getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([
        {
          ...MOCK_CASE.docketEntries[0],
          docketNumber: MOCK_CASE.docketNumber,
          filedBy: 'Orig',
        },
        {
          ...MOCK_CASE.docketEntries[0],
          docketNumber: '102-20',
          filedBy: 'Orig',
        },
      ]);
      getCaseByDocketNumber.mockImplementation((args: any) => {
        return args.docketNumber === '102-20'
          ? Promise.resolve(memberCase)
          : Promise.resolve(caseRecord);
      });
      const result = await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: { ...caseRecord.docketEntries[0], filedBy: 'New' },
        },
        mockDocketClerkUser,
      );
      expect(result.paperServiceParties).toBeDefined();
    });

    it('should handle aggregation errors', async () => {
      caseRecord.leadDocketNumber = MOCK_CASE.docketNumber;
      caseRecord.consolidatedCases = [{ docketNumber: '102-20' }];
      caseRecord.docketEntries[0].filedBy = 'Orig';
      getDocketEntriesByDocketNumberAndDocketEntryId.mockResolvedValue([
        {
          ...MOCK_CASE.docketEntries[0],
          docketNumber: MOCK_CASE.docketNumber,
          filedBy: 'Orig',
        },
        {
          ...MOCK_CASE.docketEntries[0],
          docketNumber: '102-20',
          filedBy: 'Orig',
        },
      ]);
      getCaseByDocketNumber.mockImplementation((args: any) => {
        return args.docketNumber === '102-20'
          ? Promise.reject(new Error('agg error'))
          : Promise.resolve(caseRecord);
      });
      await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: { ...caseRecord.docketEntries[0], filedBy: 'New' },
        },
        mockDocketClerkUser,
      );
      expect(applicationContext.logger?.error).toHaveBeenCalled();
    });
  });

  describe('Edit State', () => {
    it('should parse valid editState', async () => {
      caseRecord.docketEntries[0].editState = JSON.stringify({
        documentTitle: 'Edit State Title',
        filedBy: 'Edit State Filer',
      });
      await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: { ...caseRecord.docketEntries[0], filedBy: 'New' },
        },
        mockDocketClerkUser,
      );
      expect(
        applicationContext.getUseCaseHelpers()
          .serveDocumentAndGetPaperServicePdf,
      ).toHaveBeenCalled();
    });

    it('should handle invalid editState', async () => {
      caseRecord.docketEntries[0].editState = 'invalid json';
      await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: { ...caseRecord.docketEntries[0] },
        },
        mockDocketClerkUser,
      );
      expect(updateCaseAndAssociations).toHaveBeenCalled();
    });

    it('should clear editState', async () => {
      caseRecord.docketEntries[0].editState = JSON.stringify({
        filedBy: 'Old',
      });
      const result = await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: { ...caseRecord.docketEntries[0] },
        },
        mockDocketClerkUser,
      );
      const updatedEntry = result.caseDetail.docketEntries.find(
        (de: any) => de.docketEntryId === mockDocketEntryId,
      );
      expect(updatedEntry?.editState).toBe('{}');
    });
  });

  describe('Section Assignment', () => {
    it('should use selectedSection for case services user', async () => {
      getUserById.mockResolvedValue({
        ...docketClerkUser,
        section: 'caseServicesSupervisor',
      } as DbUser);
      await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: {
            ...caseRecord.docketEntries[0],
            selectedSection: 'petitions',
          },
        },
        mockDocketClerkUser,
      );
      expect(updateCaseAndAssociations).toHaveBeenCalled();
    });

    it('should use user section when selectedSection not provided', async () => {
      await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: { ...caseRecord.docketEntries[0] },
        },
        mockDocketClerkUser,
      );
      expect(updateCaseAndAssociations).toHaveBeenCalled();
    });
  });

  describe('Return Values', () => {
    it('should return complete result', async () => {
      // Set up petitioner with paper service to trigger paper service fields
      caseRecord.petitioners = [
        { ...MOCK_CASE.petitioners[0], serviceIndicator: 'Paper' },
      ];
      // Set override to trigger paper service handling
      const result = await completeDocketEntryQCInteractor(
        applicationContext,
        {
          entryMetadata: {
            ...caseRecord.docketEntries[0],
            overridePaperServiceAddress: true,
          },
        },
        mockDocketClerkUser,
      );
      expect(result).toMatchObject({
        caseDetail: expect.any(Object),
        paperServiceParties: expect.any(Array),
      });
      expect(result.paperServiceDocumentTitle).toBeDefined();
      expect(result.paperServicePdfUrl).toBeDefined();
    });
  });
});
