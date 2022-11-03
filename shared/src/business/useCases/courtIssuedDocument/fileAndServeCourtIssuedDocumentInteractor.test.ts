import {
  DOCKET_SECTION,
  SERVICE_INDICATOR_TYPES,
  TRANSCRIPT_EVENT_CODE,
} from '../../entities/EntityConstants';
import { MOCK_CASE } from '../../../test/mockCase';
import {
  applicationContext,
  testPdfDoc,
} from '../../test/createTestApplicationContext';
import { createISODateString } from '../../utilities/DateHandler';
import { docketClerkUser } from '../../../test/mockUsers';
import { fileAndServeCourtIssuedDocumentInteractor } from '../courtIssuedDocument/fileAndServeCourtIssuedDocumentInteractor';

describe('fileAndServeCourtIssuedDocumentInteractor', () => {
  let caseRecord;
  let mockWorkItem;
  let mockDocketEntryWithWorkItem;

  const mockPdfUrl = 'www.example.com';
  const mockClientConnectionId = 'ABC123';
  const mockDocketEntryId = 'c54ba5a9-b37b-479d-9201-067ec6e335ba';

  beforeEach(() => {
    caseRecord = {
      ...MOCK_CASE,
      docketEntries: [
        mockDocketEntryWithWorkItem,
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          docketNumber: MOCK_CASE.docketNumber,
          documentTitle: 'Order to Show Cause',
          documentType: 'Order to Show Cause',
          eventCode: 'OSC',
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: docketClerkUser.userId,
          signedJudgeName: 'Dredd',
          userId: docketClerkUser.userId,
        },
        {
          docketEntryId: '7f61161c-ede8-43ba-8fab-69e15d057012',
          docketNumber: MOCK_CASE.docketNumber,
          documentTitle: 'Transcript of [anything] on [date]',
          documentType: 'Transcript',
          eventCode: TRANSCRIPT_EVENT_CODE,
          userId: docketClerkUser.userId,
        },
      ],
    };

    mockWorkItem = {
      docketNumber: MOCK_CASE.docketNumber,
      section: DOCKET_SECTION,
      sentBy: docketClerkUser.name,
      sentByUserId: docketClerkUser.userId,
      workItemId: 'b4c7337f-9ca0-45d9-9396-75e003f81e32',
    };

    mockDocketEntryWithWorkItem = {
      docketEntryId: mockDocketEntryId,
      docketNumber: MOCK_CASE.docketNumber,
      documentTitle: 'Order',
      documentType: 'Order',
      eventCode: 'O',
      signedAt: '2019-03-01T21:40:46.415Z',
      signedByUserId: docketClerkUser.userId,
      signedJudgeName: 'Dredd',
      userId: docketClerkUser.userId,
      workItem: mockWorkItem,
    };

    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);

    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => ({
        Body: testPdfDoc,
      }),
    });

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

    applicationContext
      .getUseCaseHelpers()
      .stampDocumentForService.mockReturnValue(testPdfDoc);
  });

  it('should throw an error when the user is not authorized to file and serve a court issued document', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
        clientConnectionId: mockClientConnectionId,
        docketEntryId: caseRecord.docketEntries[1].docketEntryId,
        docketNumbers: [caseRecord.docketNumber],
        form: {},
        subjectCaseDocketNumber: caseRecord.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error when the docket entry is not found on the case', async () => {
    await expect(
      fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
        clientConnectionId: mockClientConnectionId,
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bd',
        docketNumbers: [caseRecord.docketNumber],
        form: {
          documentType: 'Order',
        },
        subjectCaseDocketNumber: caseRecord.docketNumber,
      }),
    ).rejects.toThrow('Docket entry not found');
  });

  it('should throw an error when the docket entry has already been served', async () => {
    caseRecord.docketEntries[1].servedAt = createISODateString();

    await expect(
      fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
        clientConnectionId: mockClientConnectionId,
        docketEntryId: caseRecord.docketEntries[1].docketEntryId,
        docketNumbers: [caseRecord.docketNumber],
        form: {
          documentType: 'Order',
        },
        subjectCaseDocketNumber: caseRecord.docketNumber,
      }),
    ).rejects.toThrow('Docket entry has already been served');
  });

  it('should throw an error when the document is already pending service', async () => {
    const docketEntry = caseRecord.docketEntries[0];
    docketEntry.isPendingService = true;

    await expect(
      fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
        clientConnectionId: 'testing',
        docketEntryId: docketEntry.docketEntryId,
        docketNumbers: [docketEntry.docketNumber],
        form: docketEntry,
        subjectCaseDocketNumber: docketEntry.docketNumber,
      }),
    ).rejects.toThrow('Docket entry is already being served');

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).not.toHaveBeenCalled();
  });

  it('should make a call to stamp the document as served', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      docketEntryId: caseRecord.docketEntries[0].docketEntryId,
      docketNumbers: [caseRecord.docketNumber],
      form: caseRecord.docketEntries[0],
      subjectCaseDocketNumber: caseRecord.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().stampDocumentForService,
    ).toHaveBeenCalled();
  });

  it('should count the number of pages in the document to be served', async () => {
    const mockNumberOfPages = 90;
    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockReturnValue(mockNumberOfPages);

    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      docketEntryId: caseRecord.docketEntries[0].docketEntryId,
      docketNumbers: [caseRecord.docketNumber],
      form: caseRecord.docketEntries[0],
      subjectCaseDocketNumber: caseRecord.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument.mock
        .calls[0][0],
    ).toMatchObject({
      docketEntryId: caseRecord.docketEntries[0].docketEntryId,
    });
    expect(
      applicationContext.getUseCaseHelpers().fileDocumentOnOneCase.mock
        .calls[0][0].docketEntryEntity.numberOfPages,
    ).toBe(mockNumberOfPages);
  });

  // it('should populate attachments, date, documentTitle, documentType, eventCode, freeText, scenario, and serviceStamp from the form on the docketEntry', async () => {
  //   const mockAttachments = true;
  //   const mockDate = '2009-03-01T21:40:46.415Z';
  //   const mockDocumentTitle = 'Important Filing';
  //   const mockDocumentType = 'Order';
  //   const mockEventCode = 'O';
  //   const mockFreeText = 'Hurry! This is urgent';
  //   const mockScenario = 'Standard';
  //   const mockServiceStamp = 'Blah blah blah';

  //   await fileDocumentOnOneCase({
  //     applicationContext,
  //     caseEntity: mockCaseEntity,
  //     form: {
  //       attachments: mockAttachments,
  //       date: mockDate,
  //       documentType: mockDocumentType,
  //       eventCode: mockEventCode,
  //       freeText: mockFreeText,
  //       generatedDocumentTitle: mockDocumentTitle,
  //       scenario: mockScenario,
  //       serviceStamp: mockServiceStamp,
  //     },
  //     numberOfPages: 1,
  //     originalSubjectDocketEntry: {
  //       docketEntryId: mockDocketEntryId,
  //       judge: judgeUser.name,
  //       signedAt: '2019-03-01T21:40:46.415Z',
  //       signedByUserId: judgeUser.userId,
  //       signedJudgeName: judgeUser.name,
  //     },
  //     user: docketClerkUser,
  //   });

  //   const expectedDocketEntry = applicationContext
  //     .getUseCaseHelpers()
  //     .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
  //       doc => doc.docketEntryId === mockDocketEntryId,
  //     );
  //   expect(expectedDocketEntry).toMatchObject({
  //     attachments: mockAttachments,
  //     date: mockDate,
  //     documentTitle: mockDocumentTitle,
  //     documentType: mockDocumentType,
  //     eventCode: mockEventCode,
  //     freeText: mockFreeText,
  //     scenario: mockScenario,
  //     serviceStamp: mockServiceStamp,
  //   });
  // });

  // it('should not use filedBy from the original docket entry to populate the new docketEntry`s filedBy value', async () => {
  //   const mockFiledBy = 'Someone';

  //   await fileDocumentOnOneCase({
  //     applicationContext,
  //     caseEntity: mockCaseEntity,
  //     form: {
  //       documentType: 'Order',
  //       eventCode: 'O',
  //     },
  //     numberOfPages: 1,
  //     originalSubjectDocketEntry: {
  //       docketEntryId: mockDocketEntryId,
  //       filedBy: mockFiledBy,
  //       judge: judgeUser.name,
  //       signedAt: '2019-03-01T21:40:46.415Z',
  //       signedByUserId: judgeUser.userId,
  //       signedJudgeName: judgeUser.name,
  //     },
  //     user: docketClerkUser,
  //   });

  //   const expectedDocketEntry = applicationContext
  //     .getUseCaseHelpers()
  //     .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
  //       doc => doc.docketEntryId === mockDocketEntryId,
  //     );
  //   expect(expectedDocketEntry.filedBy).not.toBe(mockFiledBy);
  // });

  // it('should set isOnDocketRecord to true on the created docketEntry', async () => {
  //   await fileDocumentOnOneCase({
  //     applicationContext,
  //     caseEntity: mockCaseEntity,
  //     form: {
  //       documentType: 'Order',
  //       eventCode: 'O',
  //     },
  //     numberOfPages: 1,
  //     originalSubjectDocketEntry: {
  //       docketEntryId: mockDocketEntryId,
  //       judge: judgeUser.name,
  //       signedAt: '2019-03-01T21:40:46.415Z',
  //       signedByUserId: judgeUser.userId,
  //       signedJudgeName: judgeUser.name,
  //     },
  //     user: docketClerkUser,
  //   });

  //   const expectedDocketEntry = applicationContext
  //     .getUseCaseHelpers()
  //     .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
  //       doc => doc.docketEntryId === mockDocketEntryId,
  //     );
  //   expect(expectedDocketEntry.isOnDocketRecord).toBe(true);
  // });

  // it('should mark the docketEntry as NOT a draft', async () => {
  //   await fileDocumentOnOneCase({
  //     applicationContext,
  //     caseEntity: mockCaseEntity,
  //     form: {
  //       documentType: 'Order',
  //       eventCode: 'O',
  //     },
  //     numberOfPages: 1,
  //     originalSubjectDocketEntry: {
  //       docketEntryId: mockDocketEntryId,
  //       isDraft: true,
  //       judge: judgeUser.name,
  //       signedAt: '2019-03-01T21:40:46.415Z',
  //       signedByUserId: judgeUser.userId,
  //       signedJudgeName: judgeUser.name,
  //     },
  //     user: docketClerkUser,
  //   });

  //   const expectedDocketEntry = applicationContext
  //     .getUseCaseHelpers()
  //     .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
  //       doc => doc.docketEntryId === mockDocketEntryId,
  //     );
  //   expect(expectedDocketEntry.isDraft).toBe(false);
  // });

  // it('should set the docketEntry as served', async () => {
  //   await fileDocumentOnOneCase({
  //     applicationContext,
  //     caseEntity: mockCaseEntity,
  //     form: {
  //       documentType: 'Order',
  //       eventCode: 'O',
  //     },
  //     numberOfPages: 1,
  //     originalSubjectDocketEntry: {
  //       docketEntryId: mockDocketEntryId,
  //       draftOrderState: 'abc',
  //       judge: judgeUser.name,
  //       signedAt: '2019-03-01T21:40:46.415Z',
  //       signedByUserId: judgeUser.userId,
  //       signedJudgeName: judgeUser.name,
  //     },
  //     user: docketClerkUser,
  //   });

  //   expect(DocketEntry.prototype.setAsServed).toHaveBeenCalled();
  // });

  it('should send a notification to the user which includes a paper service PDF when all processing is done and at least one party on the case has paper service', async () => {
    caseRecord.petitioners[0].serviceIndicator =
      SERVICE_INDICATOR_TYPES.SI_PAPER;

    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      docketEntryId: caseRecord.docketEntries[0].docketEntryId,
      docketNumbers: [caseRecord.docketNumber],
      form: caseRecord.docketEntries[0],
      subjectCaseDocketNumber: caseRecord.docketNumber,
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0],
    ).toMatchObject({
      clientConnectionId: mockClientConnectionId,
      message: expect.objectContaining({
        action: 'serve_document_complete',
        alertSuccess: {
          message: 'Document served.',
          overwritable: false,
        },
        pdfUrl: mockPdfUrl,
      }),
      userId: docketClerkUser.userId,
    });
  });

  it('should call the persistence method to set and unset the pending service status on the document', async () => {
    const docketEntry = caseRecord.docketEntries[0];
    docketEntry.isPendingService = false;

    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      docketEntryId: docketEntry.docketEntryId,
      docketNumbers: [docketEntry.docketNumber],
      form: docketEntry,
      subjectCaseDocketNumber: docketEntry.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketEntryId: docketEntry.docketEntryId,
      docketNumber: caseRecord.docketNumber,
      status: true,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketEntryId: docketEntry.docketEntryId,
      docketNumber: caseRecord.docketNumber,
      status: false,
    });
  });

  it('should save the generated notice to s3', async () => {
    applicationContext
      .getUseCaseHelpers()
      .addServedStampToDocument.mockReturnValue({});

    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId: mockClientConnectionId,
      docketEntryId: caseRecord.docketEntries[0].docketEntryId,
      docketNumbers: [caseRecord.docketNumber],
      form: {
        ...caseRecord.docketEntries[0],
        documentType: 'Notice',
        eventCode: 'ODJ',
      },
      subjectCaseDocketNumber: caseRecord.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0],
    ).toMatchObject({
      document: expect.anything(),
      key: mockDocketEntryId,
    });
  });
});
