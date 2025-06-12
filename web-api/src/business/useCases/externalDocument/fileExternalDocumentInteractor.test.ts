import '@web-api/persistence/postgres/caseDeadlines/mocks.jest';
import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import '@web-api/persistence/postgres/utils/mocks.jest';
jest.mock(
  '@web-api/persistence/dynamo/cases/deleteCaseTrialSortMappingRecords',
);
jest.mock(
  '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations',
);
import {
  AUTOMATIC_BLOCKED_REASONS,
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  OBJECTIONS_OPTIONS_MAP,
  PARTY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
  SIMULTANEOUS_DOCUMENT_EVENT_CODES,
} from '@shared/business/entities/EntityConstants';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '@shared/business/test/createTestApplicationContext';
import { fileExternalDocumentInteractor } from './fileExternalDocumentInteractor';
import { getCaseDeadlinesByDocketNumber as getCaseDeadlinesByDocketNumberMock } from '@web-api/persistence/postgres/caseDeadlines/getCaseDeadlinesByDocketNumber';
import {
  mockDocketClerkUser,
  mockIrsPractitionerUser,
} from '@shared/test/mockAuthUsers';
import { upsertWorkItems as upsertWorkItemsMock } from '@web-api/persistence/postgres/workitems/upsertWorkItems';
import { getCaseByDocketNumber as getCaseByDocketNumberMock } from '@web-api/persistence/postgres/cases/getCaseByDocketNumber';
import { getCasesByDocketNumbers as getCasesByDocketNumbersMock } from '@web-api/persistence/postgres/cases/getCasesByDocketNumbers';
import { deleteCaseTrialSortMappingRecords as deleteCaseTrialSortMappingRecordsMock } from '@web-api/persistence/dynamo/cases/deleteCaseTrialSortMappingRecords';
import { MOCK_CASE_DEADLINE } from '@shared/test/mockCaseDeadline';
import { CaseDeadline } from '@shared/business/entities/CaseDeadline';
import { updateCaseAndAssociations as updateCaseAndAssociationsMock } from '@web-api/business/useCaseHelper/caseAssociation/updateCaseAndAssociations';
import { tryGetLocks as tryGetLocksMock } from '@web-api/persistence/postgres/utils/operation/tryGetLocks';

describe('fileExternalDocumentInteractor', () => {
  const getCaseDeadlinesByDocketNumber = jest.mocked(
    getCaseDeadlinesByDocketNumberMock,
  );
  const deleteCaseTrialSortMappingRecords = jest.mocked(
    deleteCaseTrialSortMappingRecordsMock,
  );

  const upsertWorkItems = upsertWorkItemsMock as jest.Mock;
  const mockDocketEntryId = applicationContext.getUniqueId();
  const getCaseByDocketNumber = jest.mocked(getCaseByDocketNumberMock);
  const getCasesByDocketNumbers = jest.mocked(getCasesByDocketNumbersMock);
  const updateCaseAndAssociations = jest
    .mocked(updateCaseAndAssociationsMock)
    .mockImplementation(({ caseToUpdate }) => Promise.resolve(caseToUpdate));
  const tryGetLocks = jest.mocked(tryGetLocksMock);

  let caseRecord;

  beforeEach(() => {
    caseRecord = {
      caseCaption: 'Caption',
      caseType: CASE_TYPES_MAP.deficiency,
      createdAt: '',
      docketEntries: [
        {
          docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
          docketNumber: '45678-18',
          documentTitle: 'first record',
          documentType: 'Petition',
          eventCode: 'P',
          filedBy: 'Test Petitioner',
          filedByRole: ROLES.petitioner,
          filingDate: '2018-03-01T00:01:00.000Z',
          index: 1,
          isOnDocketRecord: true,
          servedAt: '2020-07-17T19:28:29.675Z',
          servedParties: [],
          userId: '15fac684-d333-45c2-b414-4af63a7f7613',
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: '45678-18',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          filedByRole: ROLES.petitioner,
          userId: '15fac684-d333-45c2-b414-4af63a7f7613',
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: '45678-18',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          filedByRole: ROLES.petitioner,
          userId: '15fac684-d333-45c2-b414-4af63a7f7613',
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: '45678-18',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          filedByRole: ROLES.petitioner,
          userId: '15fac684-d333-45c2-b414-4af63a7f7613',
        },
      ],
      docketNumber: '45678-18',
      filingType: 'Myself',
      leadDocketNumber: '45678-18',
      partyType: PARTY_TYPES.petitioner,
      petitioners: [
        {
          address1: '123 Main St',
          city: 'Somewhere',
          contactType: CONTACT_TYPES.primary,
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'fieri@example.com',
          name: 'Roslindis Angelino',
          phone: '1234567890',
          postalCode: '12345',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          state: 'CA',
        },
      ],
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
      role: ROLES.petitioner,
      userId: '0e97c6b4-d299-44f5-af99-2ce905d520f2',
    };

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(mockIrsPractitionerUser);

    getCaseByDocketNumber.mockResolvedValue(caseRecord);
    getCasesByDocketNumbers.mockResolvedValue([caseRecord]);
  });

  it('should throw an error when the user is not authorized to file an external document on a case', async () => {
    await expect(
      fileExternalDocumentInteractor(
        applicationContext,
        {
          documentMetadata: {
            docketNumber: caseRecord.docketNumber,
            documentTitle: 'Memorandum in Support',
            documentType: 'Memorandum in Support',
            eventCode: 'A',
            filedBy: 'Test Petitioner',
            primaryDocumentId: mockDocketEntryId,
          },
        },
        mockDocketClerkUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should validate docket entry entities before adding them to the case and not call service or persistence methods', async () => {
    await expect(
      fileExternalDocumentInteractor(
        applicationContext,
        {
          documentMetadata: {
            docketNumber: caseRecord.docketNumber,
            documentTitle: 'Memorandum in Support',
            documentType: 'Memorandum in Support',
            eventCode: 'XYZ',
            filedBy: 'Test Petitioner',
            primaryDocumentId: mockDocketEntryId,
          },
        },
        mockIrsPractitionerUser,
      ),
    ).rejects.toThrow('The DocketEntry entity was invalid.');

    expect(getCaseByDocketNumber).toHaveBeenCalled();
    expect(upsertWorkItems).not.toHaveBeenCalled();
    expect(updateCaseAndAssociations).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).not.toHaveBeenCalled();
  });

  it('should add documents and workitems and auto-serve the documents on the parties with an electronic service indicator', async () => {
    const updatedCase = await fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          primaryDocumentId: mockDocketEntryId,
        },
      },
      mockIrsPractitionerUser,
    );

    expect(getCaseByDocketNumber).toHaveBeenCalled();
    expect(upsertWorkItems).toHaveBeenCalled();
    expect(updateCaseAndAssociations).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();
    expect(updatedCase!.docketEntries[4].servedAt).toBeDefined();
  });

  it('should add documents and workitems and auto-serve the documents on the parties with an electronic service indicator across consolidated cases', async () => {
    const consolidatedCase = {
      caseCaption: 'Caption',
      caseType: CASE_TYPES_MAP.deficiency,
      createdAt: '',
      docketEntries: [
        {
          docketEntryId: '8675309b-18d0-43ec-bafb-654e83405411',
          docketNumber: '45678-18',
          documentTitle: 'first record',
          documentType: 'Petition',
          eventCode: 'P',
          filedBy: 'Test Petitioner',
          filedByRole: ROLES.petitioner,
          filingDate: '2018-03-01T00:01:00.000Z',
          index: 1,
          isOnDocketRecord: true,
          servedAt: '2020-07-17T19:28:29.675Z',
          servedParties: [],
          userId: '15fac684-d333-45c2-b414-4af63a7f7613',
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: '45678-18',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          filedByRole: ROLES.petitioner,
          userId: '15fac684-d333-45c2-b414-4af63a7f7613',
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: '45678-18',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          filedByRole: ROLES.petitioner,
          userId: '15fac684-d333-45c2-b414-4af63a7f7613',
        },
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          docketNumber: '45678-18',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          filedByRole: ROLES.petitioner,
          userId: '15fac684-d333-45c2-b414-4af63a7f7613',
        },
      ],
      docketNumber: '45679-18',
      filingType: 'Myself',
      leadDocketNumber: '45678-18',
      partyType: PARTY_TYPES.petitioner,
      petitioners: [
        {
          address1: '123 Main St',
          city: 'Somewhere',
          contactType: CONTACT_TYPES.primary,
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'fieri@example.com',
          name: 'Roslindis Angelino',
          phone: '1234567890',
          postalCode: '12345',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          state: 'CA',
        },
      ],
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
      role: ROLES.petitioner,
      userId: '0e97c6b4-d299-44f5-af99-2ce905d520f2',
    };

    getCaseByDocketNumber.mockResolvedValueOnce(caseRecord);
    getCasesByDocketNumbers.mockResolvedValueOnce([
      caseRecord,
      consolidatedCase as any,
    ]);

    const updatedCase = await fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          consolidatedCasesToFileAcross: [
            {
              docketNumber: caseRecord.docketNumber,
              leadDocketNumber: caseRecord.docketNumber,
            },
            {
              docketNumber: consolidatedCase.docketNumber,
              leadDocketNumber: caseRecord.docketNumber,
            },
          ],
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          primaryDocumentId: mockDocketEntryId,
        },
      },
      mockIrsPractitionerUser,
    );

    expect(getCaseByDocketNumber).toHaveBeenCalledTimes(1);
    expect(getCasesByDocketNumbers).toHaveBeenCalledTimes(1);
    expect(upsertWorkItems).toHaveBeenCalledTimes(1);
    expect(updateCaseAndAssociations).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalledTimes(2);
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalledTimes(2);
    expect(updatedCase!.docketEntries[4].servedAt).toBeDefined();
  });

  it('should set secondary document and secondary supporting documents to lodged', async () => {
    const updatedCase = await fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Motion for Leave to File',
          documentType: 'Motion for Leave to File',
          eventCode: 'M115',
          filedBy: 'Test Petitioner',
          objections: OBJECTIONS_OPTIONS_MAP.NO,
          primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          scenario: 'Nonstandard H',
          secondaryDocument: {
            docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
            documentTitle: 'Motion for Judgment on the Pleadings',
            documentType: 'Motion for Judgment on the Pleadings',
            eventCode: 'M121',
            filedBy: 'Test Petitioner',
            objections: OBJECTIONS_OPTIONS_MAP.NO,
          },
          secondarySupportingDocuments: [
            {
              docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bd',
              documentTitle: 'Motion for in Camera Review',
              documentType: 'Motion for in Camera Review',
              eventCode: 'M135',
              filedBy: 'Test Petitioner',
              objections: OBJECTIONS_OPTIONS_MAP.NO,
            },
          ],
          supportingDocuments: [
            {
              docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335be',
              documentTitle: 'Civil Penalty Approval Form',
              documentType: 'Civil Penalty Approval Form',
              eventCode: 'CIVP',
              filedBy: 'Test Petitioner',
            },
          ],
        },
      },
      mockIrsPractitionerUser,
    );
    expect(updateCaseAndAssociations).toHaveBeenCalled();
    expect(updatedCase!.docketEntries).toMatchObject([
      {}, // first 4 docs were already on the case
      {},
      {},
      {},
      {
        eventCode: 'M115',
        isOnDocketRecord: true,
        // primary document
        lodged: undefined,
      },
      {
        eventCode: 'CIVP',
        isOnDocketRecord: true,
        // supporting document
        lodged: undefined,
      },
      {
        eventCode: 'M121', //secondary document
        isOnDocketRecord: true,
        lodged: true,
      },
      {
        eventCode: 'M135', // secondary supporting document
        isOnDocketRecord: true,
        lodged: true,
      },
    ]);
  });

  it('should add documents and workitems but NOT auto-serve Simultaneous documents on the parties', async () => {
    const updatedCase = await fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Simultaneous Memoranda of Law',
          documentType: 'Simultaneous Memoranda of Law',
          eventCode: SIMULTANEOUS_DOCUMENT_EVENT_CODES[0],
          filedBy: 'Test Petitioner',
          primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      },
      mockIrsPractitionerUser,
    );

    expect(getCaseByDocketNumber).toHaveBeenCalled();
    expect(upsertWorkItems).toHaveBeenCalled();
    expect(updateCaseAndAssociations).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).not.toHaveBeenCalled();
    expect(updatedCase!.docketEntries[3].status).toBeUndefined();
    expect(updatedCase!.docketEntries[3].servedAt).toBeUndefined();
  });

  it('should create a high-priority work item if the case status is calendared', async () => {
    caseRecord.status = CASE_STATUS_TYPES.calendared;
    caseRecord.trialDate = '2019-03-01T21:40:46.415Z';
    caseRecord.trialSessionId = 'c54ba5a9-b37b-479d-9201-067ec6e335bc';

    await fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Simultaneous Memoranda of Law',
          documentType: 'Simultaneous Memoranda of Law',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      },
      mockIrsPractitionerUser,
    );

    expect(upsertWorkItems).toHaveBeenCalled();
    expect(upsertWorkItems.mock.calls[0][0]).toMatchObject({
      workItems: [
        { highPriority: true, trialDate: '2019-03-01T21:40:46.415Z' },
      ],
    });
  });

  it('should create a not-high-priority work item if the case status is not calendared', async () => {
    caseRecord.status = CASE_STATUS_TYPES.new;

    await fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Simultaneous Memoranda of Law',
          documentType: 'Simultaneous Memoranda of Law',
          eventCode: 'A',
          filedBy: 'test Petitioner',
          primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      },
      mockIrsPractitionerUser,
    );

    expect(upsertWorkItems).toHaveBeenCalled();
    expect(upsertWorkItems.mock.calls[0][0]).toMatchObject({
      workItems: [{ highPriority: false }],
    });
  });

  it('should automatically block the case if the document filed is a tracked document', async () => {
    await fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          category: 'Application',
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Application for Waiver of Filing Fee',
          documentType: 'Application for Waiver of Filing Fee',
          eventCode: 'APPW',
          filedBy: 'Test Petitioner',
          primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      },
      mockIrsPractitionerUser,
    );

    expect(
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate,
    ).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
    });
    expect(deleteCaseTrialSortMappingRecords).toHaveBeenCalled();
  });

  it('should automatically block the case with deadlines if the document filed is a tracked document and the case has a deadline', async () => {
    getCaseDeadlinesByDocketNumber.mockResolvedValue([
      new CaseDeadline(MOCK_CASE_DEADLINE),
    ]);

    await fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          category: 'Application',
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Application for Waiver of Filing Fee',
          documentType: 'Application for Waiver of Filing Fee',
          eventCode: 'APPW',
          filedBy: 'Test Petitioner',
          primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      },
      mockIrsPractitionerUser,
    );

    expect(
      updateCaseAndAssociations.mock.calls[0][0].caseToUpdate,
    ).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate,
    });
    expect(deleteCaseTrialSortMappingRecords).toHaveBeenCalled();
  });

  it('should not sendServedPartiesEmails if docketEntryId is undefined', async () => {
    await fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Memorandum in Support',
          documentType: 'Memorandum in Support',
          eventCode: 'XYZ',
          filedBy: 'Test Petitioner',
          primaryDocumentId: undefined,
        },
      },
      mockIrsPractitionerUser,
    );

    expect(
      applicationContext.getUseCases().addCoversheetInteractor,
    ).not.toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).not.toHaveBeenCalled();
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    tryGetLocks.mockResolvedValueOnce([
      { successfullyLocked: false, identifier: 'abc' },
    ]);

    await expect(
      fileExternalDocumentInteractor(
        applicationContext,
        {
          documentMetadata: {
            category: 'Application',
            docketNumber: caseRecord.docketNumber,
            documentTitle: 'Application for Waiver of Filing Fee',
            documentType: 'Application for Waiver of Filing Fee',
            eventCode: 'APPW',
            filedBy: 'Test Petitioner',
            primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          },
        },
        mockIrsPractitionerUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire a lock on the case', async () => {
    await fileExternalDocumentInteractor(
      applicationContext,
      {
        documentMetadata: {
          category: 'Application',
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Application for Waiver of Filing Fee',
          documentType: 'Application for Waiver of Filing Fee',
          eventCode: 'APPW',
          filedBy: 'Test Petitioner',
          primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        },
      },
      mockIrsPractitionerUser,
    );

    expect(tryGetLocks).toHaveBeenCalledWith(
      expect.objectContaining({
        identifiers: [`case|${caseRecord.docketNumber}`],
      }),
    );
  });
});
