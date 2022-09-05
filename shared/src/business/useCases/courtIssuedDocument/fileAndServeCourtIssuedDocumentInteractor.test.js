/* eslint-disable max-lines */
const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  COURT_ISSUED_EVENT_CODES,
  DOCKET_SECTION,
  SERVICE_INDICATOR_TYPES,
  TRANSCRIPT_EVENT_CODE,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const {
  ENTERED_AND_SERVED_EVENT_CODES,
} = require('../../entities/courtIssuedDocument/CourtIssuedDocumentConstants');
const {
  fileAndServeCourtIssuedDocumentInteractor,
} = require('../courtIssuedDocument/fileAndServeCourtIssuedDocumentInteractor');
const { Case } = require('../../entities/cases/Case');
const { createISODateString } = require('../../utilities/DateHandler');
const { docketClerkUser } = require('../../../test/mockUsers');
const { MOCK_CASE } = require('../../../test/mockCase');
const { v4: uuidv4 } = require('uuid');

describe('fileAndServeCourtIssuedDocumentInteractor', () => {
  let caseRecord;
  let mockTrialSession;

  const mockPdfUrl = 'www.example.com';
  const clientConnectionId = 'ABC123';
  const mockWorkItem = {
    docketNumber: MOCK_CASE.docketNumber,
    section: DOCKET_SECTION,
    sentBy: docketClerkUser.name,
    sentByUserId: docketClerkUser.userId,
    workItemId: 'b4c7337f-9ca0-45d9-9396-75e003f81e32',
  };

  const mockDocketEntryWithWorkItem = {
    docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
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

  const docketEntriesWithCaseClosingEventCodes =
    ENTERED_AND_SERVED_EVENT_CODES.map(eventCode => {
      const eventCodeMap = COURT_ISSUED_EVENT_CODES.find(
        entry => entry.eventCode === eventCode,
      );

      return {
        docketEntryId: uuidv4(),
        documentType: eventCodeMap.documentType,
        eventCode,
        signedAt: createISODateString(),
        signedByUserId: uuidv4(),
        signedJudgeName: 'Chief Judge',
        userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
        workItem: mockWorkItem,
      };
    });

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .saveDocumentFromLambda.mockImplementation(() => {});

    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: mockPdfUrl,
      });

    applicationContext
      .getNotificationGateway()
      .sendNotificationToUser.mockReturnValue(null);
  });

  beforeEach(() => {
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);

    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

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

    mockTrialSession = {
      caseOrder: [
        {
          docketNumber: '101-20',
        },
      ],
      isCalendared: true,
      judge: {
        name: 'Judge Colvin',
        userId: 'dabbad00-18d0-43ec-bafb-654e83405416',
      },
      maxCases: 100,
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      sessionType: 'Regular',
      startDate: '2019-11-27T05:00:00.000Z',
      startTime: '10:00',
      swingSession: true,
      swingSessionId: '208a959f-9526-4db5-b262-e58c476a4604',
      term: 'Fall',
      termYear: '2019',
      trialLocation: 'Houston, Texas',
    };

    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(mockTrialSession);

    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockReturnValue(1);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(caseRecord);

    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => ({
        Body: testPdfDoc,
      }),
    });

    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockReturnValue(true);
  });

  it('should throw an error if not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
        clientConnectionId,
        docketEntryId: caseRecord.docketEntries[1].docketEntryId,
        docketNumbers: [caseRecord.docketNumber],
        documentType: 'Memorandum in Support',
        subjectCaseDocketNumber: caseRecord.docketNumber,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if the document is not found on the case', async () => {
    await expect(
      fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
        clientConnectionId,
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bd',
        docketNumbers: [caseRecord.docketNumber],
        form: {
          documentType: 'Order',
        },
        subjectCaseDocketNumber: caseRecord.docketNumber,
      }),
    ).rejects.toThrow('Docket entry not found');
  });

  it('should throw an error if the docket entry is already served', async () => {
    caseRecord.docketEntries[1].servedAt = createISODateString();

    await expect(
      fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
        clientConnectionId,
        docketEntryId: caseRecord.docketEntries[1].docketEntryId,
        docketNumbers: [caseRecord.docketNumber],
        form: {
          documentType: 'Order',
        },
        subjectCaseDocketNumber: caseRecord.docketNumber,
      }),
    ).rejects.toThrow('Docket entry has already been served');
  });

  it('should set the document as served and update the case and work items for a generic order document', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      docketEntryId: caseRecord.docketEntries[0].docketEntryId,
      docketNumbers: [caseRecord.docketNumber],
      form: caseRecord.docketEntries[0],
      subjectCaseDocketNumber: caseRecord.docketNumber,
    });

    const updatedCase =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate;
    const updatedDocument = updatedCase.docketEntries.find(
      docketEntry =>
        docketEntry.docketEntryId === caseRecord.docketEntries[0].docketEntryId,
    );

    expect(updatedDocument.servedAt).toBeDefined();
    expect(updatedDocument.filingDate).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox,
    ).toHaveBeenCalled();
  });

  it('should set the number of pages present in the document to be served', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId: caseRecord.docketEntries[0].docketEntryId,
      docketNumbers: [caseRecord.docketNumber],
      form: caseRecord.docketEntries[0],
      subjectCaseDocketNumber: caseRecord.docketNumber,
    });

    const updatedCase =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate;
    const updatedDocument = updatedCase.docketEntries.find(
      docketEntry =>
        docketEntry.docketEntryId === caseRecord.docketEntries[0].docketEntryId,
    );

    expect(updatedDocument.numberOfPages).toBe(1);
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument.mock
        .calls[0][0],
    ).toMatchObject({
      docketEntryId: caseRecord.docketEntries[0].docketEntryId,
    });
  });

  it('should set the document as served and update the case and work items for a non-generic order document', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId: caseRecord.docketEntries[1].docketEntryId,
      docketNumbers: [caseRecord.docketNumber],
      form: caseRecord.docketEntries[1],
      subjectCaseDocketNumber: caseRecord.docketNumber,
    });

    const updatedCase =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate;
    const updatedDocument = updatedCase.docketEntries.find(
      docketEntry =>
        docketEntry.docketEntryId === caseRecord.docketEntries[1].docketEntryId,
    );

    expect(updatedDocument.servedAt).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox,
    ).toHaveBeenCalled();
  });

  it('should set the leadDocketNumber for work items', async () => {
    const leadDocketNumber = MOCK_CASE.docketNumber;
    const caseRecordWithLeadDocketNumber = {
      ...MOCK_CASE,
      docketEntries: [mockDocketEntryWithWorkItem],
      leadDocketNumber,
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce(caseRecordWithLeadDocketNumber)
      .mockReturnValueOnce(caseRecordWithLeadDocketNumber);

    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId:
        caseRecordWithLeadDocketNumber.docketEntries[0].docketEntryId,
      docketNumbers: [caseRecordWithLeadDocketNumber.docketNumber],
      form: caseRecordWithLeadDocketNumber.docketEntries[0],
      subjectCaseDocketNumber: caseRecordWithLeadDocketNumber.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox.mock
        .calls[0][0].workItem,
    ).toMatchObject({
      leadDocketNumber,
    });
  });

  it('should delete the case from the trial session if the case has a trialSessionId and is not calendared and the order document has an event code that should close the case', async () => {
    mockTrialSession.isCalendared = false;
    caseRecord.trialSessionId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';
    caseRecord.trialDate = '2019-03-01T21:40:46.415Z';

    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId: caseRecord.docketEntries[0].docketEntryId,
      docketNumbers: [caseRecord.docketNumber],
      form: { ...caseRecord.docketEntries[0], eventCode: 'OD' },
      subjectCaseDocketNumber: caseRecord.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
  });

  it('should remove the case from the trial session if the case has a trialSessionId and isCalendared and the order document has an event code that should close the case', async () => {
    caseRecord.trialSessionId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';
    caseRecord.trialDate = '2019-03-01T21:40:46.415Z';

    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId: caseRecord.docketEntries[0].docketEntryId,
      docketNumbers: [caseRecord.docketNumber],
      form: { ...caseRecord.docketEntries[0], eventCode: 'OD' },
      subjectCaseDocketNumber: caseRecord.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
  });

  it('should call updateCaseAutomaticBlock and deleteCaseTrialSortMappingRecords if the order document has an event code that should close the case', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      docketEntryId: caseRecord.docketEntries[0].docketEntryId,
      docketNumbers: [caseRecord.docketNumber],
      form: { ...caseRecord.docketEntries[0], eventCode: 'OD' },
      subjectCaseDocketNumber: caseRecord.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAutomaticBlock,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });

  it('should call serveDocumentAndGetPaperServicePdf and pass the resulting url and success message to `sendNotificationToUser` along with the `clientConnectionId`', async () => {
    caseRecord.petitioners[0].serviceIndicator =
      SERVICE_INDICATOR_TYPES.SI_PAPER;

    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId: caseRecord.docketEntries[0].docketEntryId,
      docketNumbers: [caseRecord.docketNumber],
      form: caseRecord.docketEntries[0],
      subjectCaseDocketNumber: caseRecord.docketNumber,
    });

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0],
    ).toEqual({
      applicationContext: expect.anything(),
      clientConnectionId,
      message: expect.objectContaining({
        action: 'file_and_serve_court_issued_document_complete',
        alertSuccess: {
          message: 'Document served. ',
          overwritable: false,
        },
        pdfUrl: mockPdfUrl,
      }),
      userId: docketClerkUser.userId,
    });
  });

  it('should call updateCase with the docket entry set as pending if the document is a tracked document', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId: caseRecord.docketEntries[1].docketEntryId,
      docketNumbers: [caseRecord.docketNumber],
      form: caseRecord.docketEntries[1],
      subjectCaseDocketNumber: caseRecord.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    const { caseToUpdate } =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0];
    const docketEntryInCaseToUpdate = caseToUpdate.docketEntries.find(
      d => d.docketEntryId === caseRecord.docketEntries[1].docketEntryId,
    );
    expect(docketEntryInCaseToUpdate).toMatchObject({
      docketEntryId: caseRecord.docketEntries[1].docketEntryId,
      pending: true,
    });
  });

  it('should set isDraft to false on a document when creating a court issued docket entry', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId: caseRecord.docketEntries[2].docketEntryId,
      docketNumbers: [caseRecord.docketNumber],
      form: caseRecord.docketEntries[2],
      subjectCaseDocketNumber: caseRecord.docketNumber,
    });

    const newlyFiledDocument =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries[2];

    expect(newlyFiledDocument).toMatchObject({
      isDraft: false,
    });
  });

  it('should update the work item and set as completed when a work item previously existed on the docket entry', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId: mockDocketEntryWithWorkItem.docketEntryId,
      docketNumbers: [mockDocketEntryWithWorkItem.docketNumber],
      form: mockDocketEntryWithWorkItem,
      subjectCaseDocketNumber: mockDocketEntryWithWorkItem.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem.mock.calls[0][0],
    ).toMatchObject({
      workItem: { completedAt: expect.anything() },
    });
  });

  it('should delete the draftOrderState from the docketEntry', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      docketEntryId: mockDocketEntryWithWorkItem.docketEntryId,
      docketNumbers: [mockDocketEntryWithWorkItem.docketNumber],
      form: {
        ...mockDocketEntryWithWorkItem,
        draftOrderState: {
          documentContents: 'Some content',
          richText: 'some content',
        },
      },
      subjectCaseDocketNumber: mockDocketEntryWithWorkItem.docketNumber,
    });

    const docketEntryToUpdate = applicationContext
      .getUseCaseHelpers()
      .updateCaseAndAssociations.mock.calls[0][0].caseToUpdate.docketEntries.find(
        d => d.docketEntryId === mockDocketEntryWithWorkItem.docketEntryId,
      );

    expect(docketEntryToUpdate).toMatchObject({ draftOrderState: null });
  });

  docketEntriesWithCaseClosingEventCodes.forEach(docketEntry => {
    it(`should set the case status to closed for event code: ${docketEntry.eventCode}`, async () => {
      await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
        clientConnectionId,
        docketEntryId: caseRecord.docketEntries[0].docketEntryId,
        docketNumbers: [caseRecord.docketNumber],
        form: {
          ...caseRecord.docketEntries[0],
          eventCode: docketEntry.eventCode,
        },
        subjectCaseDocketNumber: caseRecord.docketNumber,
      });

      const updatedCase =
        applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
          .caseToUpdate;

      expect(updatedCase.status).toEqual(CASE_STATUS_TYPES.closed);
      expect(
        applicationContext.getPersistenceGateway()
          .deleteCaseTrialSortMappingRecords,
      ).toHaveBeenCalled();
    });
  });

  it('should use original case caption to create case title when creating work item', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId,
      docketEntryId: caseRecord.docketEntries[1].docketEntryId,
      docketNumbers: [caseRecord.docketNumber],
      form: caseRecord.docketEntries[1],
      subjectCaseDocketNumber: caseRecord.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox.mock
        .calls[0][0].workItem,
    ).toMatchObject({
      caseTitle: Case.getCaseTitle(caseRecord.caseCaption),
    });
  });

  it('should throw an error if there is no one on the case with electronic or paper service', async () => {
    const petitioners = [
      {
        ...caseRecord.petitioners[0],
        serviceIndicator: 'None',
      },
    ];

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce({
        ...caseRecord,
        petitioners,
      })
      .mockReturnValueOnce({
        ...caseRecord,
        petitioners,
      });

    await expect(
      fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
        clientConnectionId,
        docketEntryId: caseRecord.docketEntries[0].docketEntryId,
        docketNumbers: [caseRecord.docketNumber],
        form: caseRecord.docketEntries[0],
        subjectCaseDocketNumber: caseRecord.docketNumber,
      }),
    ).rejects.toThrow("servedPartiesCode' is not allowed to be empty");
  });

  it('should throw an error if the document is already pending service', async () => {
    const docketEntry = caseRecord.docketEntries[0];
    docketEntry.isPendingService = true;

    await expect(
      fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
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

  it('should call the persistence method to set and unset the pending service status on the document', async () => {
    const docketEntry = caseRecord.docketEntries[0];
    docketEntry.isPendingService = false;

    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId,
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

  it('should include `Entered and Served` in the serviceStampType when the eventCode is in ENTERED_AND_SERVED_EVENT_CODES', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
      clientConnectionId,
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
      applicationContext.getUseCaseHelpers().addServedStampToDocument.mock
        .calls[0][0].serviceStampText,
    ).toContain('Entered and Served');
  });
});
