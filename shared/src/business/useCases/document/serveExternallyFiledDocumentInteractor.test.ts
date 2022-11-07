import {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  DOCKET_SECTION,
  PARTY_TYPES,
  ROLES,
  SERVICE_INDICATOR_TYPES,
} from '../../entities/EntityConstants';
import { GENERIC_ORDER_DOCUMENT_TYPE } from '../../entities/courtIssuedDocument/CourtIssuedDocumentConstants';
import {
  applicationContext,
  testPdfDoc,
} from '../../test/createTestApplicationContext';
import { serveExternallyFiledDocumentInteractor } from './serveExternallyFiledDocumentInteractor';
jest.mock('../addCoverToPdf');
import { MOCK_CASE } from '../../../test/mockCase';
import { addCoverToPdf } from '../addCoverToPdf';
import { docketClerkUser } from '../../../test/mockUsers';

describe('serveExternallyFiledDocumentInteractor', () => {
  let caseRecord;
  const DOCKET_NUMBER = '101-20';
  const DOCKET_ENTRY_ID = '225d5474-b02b-4137-a78e-2043f7a0f806';
  const mockNumberOfPages = 999;
  const clientConnectionId = '987654';
  const mockPdfUrl = 'ayo.seankingston.com';

  beforeAll(() => {
    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockReturnValue(true);

    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockReturnValue(mockNumberOfPages);

    (addCoverToPdf as jest.Mock).mockResolvedValue({
      pdfData: testPdfDoc,
    });
  });

  beforeEach(() => {
    caseRecord = {
      caseCaption: 'Caption',
      caseType: CASE_TYPES_MAP.deficiency,
      createdAt: '',
      docketEntries: [
        {
          docketEntryId: '225d5474-b02b-4137-a78e-2043f7a0f806',
          docketNumber: DOCKET_NUMBER,
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          isOnDocketRecord: true,
          userId: docketClerkUser.userId,
        },
      ],
      docketNumber: DOCKET_NUMBER,
      filingType: 'Myself',
      partyType: PARTY_TYPES.petitioner,
      petitioners: [
        {
          address1: '123 Main St',
          city: 'Somewhere',
          contactType: CONTACT_TYPES.primary,
          countryType: COUNTRY_TYPES.DOMESTIC,
          email: 'fieri@example.com',
          name: 'Guy Fieri',
          phone: '1234567890',
          postalCode: '12345',
          serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          state: 'CA',
        },
      ],
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
      role: ROLES.petitioner,
      userId: docketClerkUser.userId,
    };

    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(caseRecord);

    applicationContext
      .getUseCaseHelpers()
      .fileDocumentOnOneCase.mockImplementation(({ caseEntity }) => caseEntity);

    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: mockPdfUrl,
      });
  });

  it('should throw an error if not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      serveExternallyFiledDocumentInteractor(applicationContext, {
        clientConnectionId,
        docketEntryId: '',
        docketNumbers: [''],
        subjectCaseDocketNumber: '',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should add a coversheet to the document with the docket entry index passed in', async () => {
    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId: DOCKET_ENTRY_ID,
      docketNumbers: [DOCKET_NUMBER],
      subjectCaseDocketNumber: DOCKET_NUMBER,
    });

    expect(
      (addCoverToPdf as jest.Mock).mock.calls[0][0].docketEntryEntity.index,
    ).toBeDefined();
  });

  it('should call serveDocumentAndGetPaperServicePdf to generate a paper service pdf', async () => {
    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: 'localhost:123',
      });

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId: DOCKET_ENTRY_ID,
      docketNumbers: [DOCKET_NUMBER],
      subjectCaseDocketNumber: DOCKET_NUMBER,
    });

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf
        .mock.calls[0][0],
    ).toMatchObject({
      docketEntryId: DOCKET_ENTRY_ID,
    });
  });

  it('should complete the work item by deleting it from the QC inbox and adding it to the outbox (served)', async () => {
    caseRecord.docketEntries = [
      ...caseRecord.docketEntries,
      {
        docketEntryId: '225d5474-b02b-4137-a78e-2043f7a0f805',
        docketNumber: DOCKET_NUMBER,
        documentType: 'Administrative Record',
        eventCode: 'ADMR',
        filedBy: docketClerkUser.name,
        userId: docketClerkUser.userId,
        workItem: {
          docketEntry: {
            createdAt: '2019-03-11T21:56:01.625Z',
            docketEntryId: '225d5474-b02b-4137-a78e-2043f7a0f805',
            docketNumber: DOCKET_NUMBER,
            documentType: 'Administrative Record',
            entityName: 'DocketEntry',
            eventCode: 'ADMR',
            filedBy: docketClerkUser.name,
            filingDate: '2019-03-11T21:56:01.625Z',
            isDraft: false,
            isMinuteEntry: false,
            isOnDocketRecord: true,
            sentBy: docketClerkUser.name,
            userId: docketClerkUser.userId,
          },
          docketNumber: DOCKET_NUMBER,
          isInitializeCase: true,
          section: DOCKET_SECTION,
          sentBy: docketClerkUser.name,
          workItemId: '4a57f4fe-991f-4d4b-bca4-be2a3f5bb5f8',
        },
      },
    ];

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId: '225d5474-b02b-4137-a78e-2043f7a0f805',
      docketNumbers: [DOCKET_NUMBER],
      subjectCaseDocketNumber: DOCKET_NUMBER,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .saveWorkItemForDocketClerkFilingExternalDocument,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        workItem: expect.objectContaining({
          assigneeId: docketClerkUser.userId,
          completedAt: expect.stringContaining('T'),
          completedByUserId: docketClerkUser.userId,
          completedMessage: 'completed',
          docketNumber: DOCKET_NUMBER,
          sentBy: docketClerkUser.name,
          workItemId: '4a57f4fe-991f-4d4b-bca4-be2a3f5bb5f8',
        }),
      }),
    );
  });

  it('should add a new docket entry to the case when the docketEntry is not found by docketEntryId on the case', async () => {
    const mockMemberCase = MOCK_CASE;
    const { docketEntryId } = caseRecord.docketEntries[0];

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce(caseRecord)
      .mockReturnValueOnce({
        ...caseRecord,
        docketEntries: [],
        docketNumber: mockMemberCase.docketNumber,
      });

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId,
      docketNumbers: [DOCKET_NUMBER, mockMemberCase.docketNumber],
      subjectCaseDocketNumber: DOCKET_NUMBER,
    });

    const memberCaseUpdate =
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations.mock
        .calls[1][0].caseToUpdate;
    const memberCaseAddedDocketEntry = memberCaseUpdate.docketEntries.find(
      doc => doc.docketEntryId === docketEntryId,
    );

    expect(memberCaseAddedDocketEntry).toBeDefined();
  });

  it('should update the case with the completed work item when the work item exists', async () => {
    const mockDocketEntryWithWorkItemId =
      '225d5474-b02b-4137-a78e-2043f7a0f805';

    caseRecord.docketEntries = [
      ...caseRecord.docketEntries,
      {
        docketEntryId: mockDocketEntryWithWorkItemId,
        docketNumber: DOCKET_NUMBER,
        documentType: GENERIC_ORDER_DOCUMENT_TYPE,
        eventCode: 'O',
        filedBy: docketClerkUser.name,
        judge: 'someone',
        signedAt: '2019-03-11T21:56:01.625Z',
        signedByUserId: docketClerkUser.userId,
        signedJudgeName: 'someone',
        userId: docketClerkUser.userId,
        workItem: {
          docketEntry: {
            createdAt: '2019-03-11T21:56:01.625Z',
            docketEntryId: '225d5474-b02b-4137-a78e-2043f7a0f805',
            docketNumber: DOCKET_NUMBER,
            documentType: GENERIC_ORDER_DOCUMENT_TYPE,
            entityName: 'DocketEntry',
            eventCode: 'O',
            filedBy: docketClerkUser.name,
            filingDate: '2019-03-11T21:56:01.625Z',
            isDraft: false,
            isMinuteEntry: false,
            isOnDocketRecord: true,
            sentBy: docketClerkUser.name,
            userId: docketClerkUser.userId,
          },
          docketNumber: DOCKET_NUMBER,
          isInitializeCase: true,
          section: DOCKET_SECTION,
          sentBy: docketClerkUser.name,
          workItemId: '4a57f4fe-991f-4d4b-bca4-be2a3f5bb5f8',
        },
      },
    ];

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId: '225d5474-b02b-4137-a78e-2043f7a0f805',
      docketNumbers: [DOCKET_NUMBER],
      subjectCaseDocketNumber: DOCKET_NUMBER,
    });

    const updatedWorkItem = applicationContext
      .getPersistenceGateway()
      .updateCase.mock.calls[0][0].caseToUpdate.docketEntries.find(
        entry => entry.docketEntryId === mockDocketEntryWithWorkItemId,
      ).workItem;
    expect(updatedWorkItem.completedAt).toBeDefined();
  });

  it('should throw an error if the document is already pending service', async () => {
    caseRecord.docketEntries[0].isPendingService = true;

    await expect(
      serveExternallyFiledDocumentInteractor(applicationContext, {
        clientConnectionId,
        docketEntryId: caseRecord.docketEntries[0].docketEntryId,
        docketNumbers: [caseRecord.docketNumber],
        subjectCaseDocketNumber: DOCKET_NUMBER,
      }),
    ).rejects.toThrow('Docket entry is already being served');

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).not.toHaveBeenCalled();
  });

  it('should call the persistence method to set and unset the pending service status on the document', async () => {
    const { docketEntryId } = caseRecord.docketEntries[0];

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId,
      docketNumbers: [caseRecord.docketNumber],
      subjectCaseDocketNumber: DOCKET_NUMBER,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketEntryId,
      docketNumber: caseRecord.docketNumber,
      status: true,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketEntryId,
      docketNumber: caseRecord.docketNumber,
      status: false,
    });
  });

  it('should call the persistence method to unset the pending service status on the document if there is an error when serving', async () => {
    const { docketEntryId } = caseRecord.docketEntries[0];

    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockRejectedValueOnce(
        new Error('whoops, that is an error!'),
      );

    await expect(
      serveExternallyFiledDocumentInteractor(applicationContext, {
        clientConnectionId,
        docketEntryId,
        docketNumbers: [caseRecord.docketNumber],
        subjectCaseDocketNumber: DOCKET_NUMBER,
      }),
    ).rejects.toThrow('whoops, that is an error!');

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketEntryId,
      docketNumber: caseRecord.docketNumber,
      status: true,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketEntryId,
      docketNumber: caseRecord.docketNumber,
      status: false,
    });
  });

  it('should send a serve_document_complete notification with a success message and paper service pdf url', async () => {
    const { docketEntryId } = caseRecord.docketEntries[0];

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId,
      docketNumbers: [caseRecord.docketNumber],
      subjectCaseDocketNumber: DOCKET_NUMBER,
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0],
    ).toEqual({
      applicationContext: expect.anything(),
      clientConnectionId,
      message: expect.objectContaining({
        action: 'serve_document_complete',
        alertSuccess: {
          message: 'Your entry has been added to the docket record.',
          overwritable: false,
        },
        pdfUrl: mockPdfUrl,
      }),
      userId: docketClerkUser.userId,
    });
  });

  it('should send a serve_document_complete notification WITHOUT a paper service url when none of the served cases have paper service parties', async () => {
    caseRecord.petitioners[0].serviceIndicator =
      SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId: caseRecord.docketEntries[0].docketEntryId,
      docketNumbers: [caseRecord.docketNumber],
      subjectCaseDocketNumber: DOCKET_NUMBER,
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0].message.pdfUrl,
    ).toBeUndefined();
  });

  it('throws an error when the docket entry does not exist on the subject case', async () => {
    const mockNonExistentDocketEntryId = 'd9f645b1-c0b6-4782-a798-091760343573';

    await expect(
      serveExternallyFiledDocumentInteractor(applicationContext, {
        clientConnectionId,
        docketEntryId: mockNonExistentDocketEntryId,
        docketNumbers: [caseRecord.docketNumber],
        subjectCaseDocketNumber: DOCKET_NUMBER,
      }),
    ).rejects.toThrow('Docket entry not found');
  });

  it('throws an error when the docket entry has already been served', async () => {
    const { docketEntryId } = caseRecord.docketEntries[0];
    caseRecord.docketEntries[0].servedAt = '2018-03-01T05:00:00.000Z';

    await expect(
      serveExternallyFiledDocumentInteractor(applicationContext, {
        clientConnectionId,
        docketEntryId,
        docketNumbers: [caseRecord.docketNumber],
        subjectCaseDocketNumber: DOCKET_NUMBER,
      }),
    ).rejects.toThrow('Docket entry has already been served');
  });

  it('should only update the subjectCase when the MULTI_DOCKETABLE_PAPER_FILINGS flag is off', async () => {
    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockReturnValue(false);

    const mockMemberCase = MOCK_CASE;
    const { docketEntryId } = caseRecord.docketEntries[0];

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId,
      docketNumbers: [DOCKET_NUMBER, mockMemberCase.docketNumber],
      subjectCaseDocketNumber: DOCKET_NUMBER,
    });

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalledTimes(1);
  });

  it('should log and NOT throw an error when the docket entry pending service status cannot be updated', async () => {
    const { docketEntryId } = caseRecord.docketEntries[0];
    const mockError = 'Something went wrong';

    applicationContext
      .getPersistenceGateway()
      .updateDocketEntryPendingServiceStatus.mockReturnValueOnce('')
      .mockRejectedValue(mockError);

    await serveExternallyFiledDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId,
      docketNumbers: [caseRecord.docketNumber],
      subjectCaseDocketNumber: DOCKET_NUMBER,
    });

    expect(applicationContext.logger.error).toHaveBeenCalledWith(
      `Encountered an exception trying to reset isPendingService on Docket Number ${caseRecord.docketNumber}.`,
      mockError,
    );
  });
});
