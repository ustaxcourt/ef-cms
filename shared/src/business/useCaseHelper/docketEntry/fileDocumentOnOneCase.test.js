/* eslint-disable max-lines */
const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
  COURT_ISSUED_EVENT_CODES,
  DOCKET_SECTION,
  SYSTEM_GENERATED_DOCUMENT_TYPES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const {
  ENTERED_AND_SERVED_EVENT_CODES,
} = require('../../entities/courtIssuedDocument/CourtIssuedDocumentConstants');
const {
  MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
  MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE,
  MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
} = require('../../../test/mockCase');
const {
  SERVICE_INDICATOR_TYPES,
  TRANSCRIPT_EVENT_CODE,
} = require('../../entities/EntityConstants');
const { Case } = require('../../entities/cases/Case');
const { createISODateString } = require('../../utilities/DateHandler');
const { docketClerkUser } = require('../../../test/mockUsers');
const { fileDocumentOnOneCase } = require('./fileDocumentOnOneCase');
const { getFakeFile } = require('../../test/getFakeFile');
const { MOCK_CASE } = require('../../../test/mockCase');
const { MOCK_DOCUMENTS } = require('../../../test/mockDocuments');
const { v4: uuidv4 } = require('uuid');

describe('fileDocumentOnOneCase', () => {
  const mockDocketEntryId = '85a5b1c81eed44b6932a967af060597a';
  const mockUserId = '85a5b1c81eed44b6932a967af060597a';
  const mockNotice = 'The rain falls mainly on the plane';
  const mockPdfUrl = 'www.example.com';
  const clientConnectionId = 'ABC123';

  let updateDocketEntrySpy;
  let addDocketEntrySpy;
  let consolidatedCase1DocketEntries;
  let leadCaseDocketEntries;

  updateDocketEntrySpy = jest.spyOn(Case.prototype, 'updateDocketEntry');
  addDocketEntrySpy = jest.spyOn(Case.prototype, 'addDocketEntry');
  const mockWorkItem = {
    docketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
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

  let mockTrialSession = {
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

  beforeAll(() => {
    applicationContext
      .getNotificationGateway()
      .sendNotificationToUser.mockReturnValue(null);
  });

  beforeEach(() => {
    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: mockPdfUrl,
      });

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockReturnValue(docketClerkUser);

    applicationContext.getCurrentUser.mockReturnValue(docketClerkUser);

    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockReturnValue(1);

    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => ({
        Body: testPdfDoc,
      }),
    });

    applicationContext
      .getUseCaseHelpers()
      .fileDocumentOnOneCase.mockReturnValue(MOCK_LEAD_CASE_WITH_PAPER_SERVICE);

    leadCaseDocketEntries = [
      mockDocketEntryWithWorkItem,
      {
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
        docketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
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
        docketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'Transcript',
        eventCode: TRANSCRIPT_EVENT_CODE,
        userId: docketClerkUser.userId,
      },
    ];

    consolidatedCase1DocketEntries = MOCK_DOCUMENTS.map(docketEntry => {
      return {
        ...docketEntry,
        docketEntryId: uuidv4(),
        docketNumber: MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
      };
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
        switch (docketNumber) {
          case MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber:
            return {
              ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
              docketEntries: leadCaseDocketEntries,
            };
          case MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber:
            return {
              ...MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
              docketEntries: consolidatedCase1DocketEntries,
            };
          default:
            return {
              ...MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE,
              docketEntries: [],
            };
        }
      });
  });

  it('should save the generated notice to s3', async () => {
    await fileDocumentOnOneCase(applicationContext, {
      caseEntity: MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
      documentInfo: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge,
      newPdfDoc: getFakeFile,
      noticePdf: mockNotice,
      userId: mockUserId,
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0],
    ).toMatchObject({
      document: mockNotice,
      key: mockDocketEntryId,
    });
  });

  it('should create and serve a docket entry and add it to the docket record', async () => {
    await fileDocumentOnOneCase(applicationContext, {
      caseEntity: MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
      documentInfo: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge,
      newPdfDoc: getFakeFile,
      noticePdf: mockNotice,
      userId: mockUserId,
    });

    const expectedNotice = MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries.find(
      doc =>
        doc.documentTitle ===
        SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge
          .documentTitle,
    );
    expect(expectedNotice).toMatchObject({
      isOnDocketRecord: true,
      servedAt: expect.anything(),
      servedParties: [
        {
          email: 'petitioner@example.com',
          name: 'Test Petitioner',
        },
      ],
    });
  });

  it('should make a call to serveGeneratedNoticesOnCase', async () => {
    const mockCaseWithPaperService = new Case(
      {
        ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
        petitioners: [
          {
            ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE.petitioners[0],
            email: undefined,
            serviceIndicator: SERVICE_INDICATOR_TYPES.SI_PAPER,
          },
        ],
      },
      { applicationContext },
    );

    await fileDocumentOnOneCase(applicationContext, {
      caseEntity: mockCaseWithPaperService,
      documentInfo: SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfChangeOfTrialJudge,
      newPdfDoc: getFakeFile,
      noticePdf: getFakeFile,
      userId: mockUserId,
    });

    expect(
      applicationContext.getUseCaseHelpers().serveGeneratedNoticesOnCase,
    ).toHaveBeenCalled();
  });

  it('should call serveDocumentAndGetPaperServicePdf and pass the resulting url and success message to `sendNotificationToUser` along with the `clientConnectionId`', async () => {
    await fileDocumentOnOneCase(applicationContext, {
      clientConnectionId,
      docketEntryId: leadCaseDocketEntries[0].docketEntryId,
      docketNumbers: [
        MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
        MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
        MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
      ],
      form: leadCaseDocketEntries[0],
      subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).toHaveBeenCalled();

    expect(
      applicationContext.getNotificationGateway().sendNotificationToUser.mock
        .calls[0][0],
    ).toEqual({
      applicationContext: expect.anything(),
      clientConnectionId,
      message: expect.objectContaining({
        action: 'serve_document_complete',
        alertSuccess: {
          message: 'Document served to selected cases in group. ',
          overwritable: false,
        },
        pdfUrl: mockPdfUrl,
      }),
      userId: docketClerkUser.userId,
    });

    expect(addDocketEntrySpy).toHaveBeenCalledTimes(2);

    const leadCaseDocketEntry = updateDocketEntrySpy.mock.calls[0][0];
    const consolidatedCase1DocketEntry = addDocketEntrySpy.mock.calls[0][0];
    const consolidatedCase2DocketEntry = addDocketEntrySpy.mock.calls[1][0];

    expect(leadCaseDocketEntry).toEqual(
      expect.objectContaining({
        docketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
        workItem: expect.objectContaining(mockDocketEntryWithWorkItem.workItem),
      }),
    );

    expect(consolidatedCase1DocketEntry).toEqual(
      expect.objectContaining({
        docketNumber: MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
        workItem: expect.objectContaining({
          caseStatus: MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.status,
          caseTitle: Case.getCaseTitle(
            MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.caseCaption,
          ),
          docketNumber:
            MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
        }),
      }),
    );

    expect(consolidatedCase2DocketEntry).toEqual(
      expect.objectContaining({
        docketNumber: MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
        workItem: expect.objectContaining({
          caseStatus: MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.status,
          caseTitle: Case.getCaseTitle(
            MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.caseCaption,
          ),
          docketNumber:
            MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
        }),
      }),
    );

    const initialCall = 1;
    const finallyBlockCalls = 3;

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledTimes(finallyBlockCalls + initialCall);
  });

  it('should create a work item and add it to the outbox for each case', async () => {
    await fileDocumentOnOneCase(applicationContext, {
      clientConnectionId,
      docketEntryId: leadCaseDocketEntries[0].docketEntryId,
      docketNumbers: [
        MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
        MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
        MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
      ],
      form: leadCaseDocketEntries[0],
      subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItem.mock.calls[0][0]
        .workItem.docketNumber,
    ).toEqual(MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber);
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem.mock.calls[1][0]
        .workItem.docketNumber,
    ).toEqual(MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber);
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem.mock.calls[2][0]
        .workItem.docketNumber,
    ).toEqual(MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber);

    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox.mock
        .calls[0][0].workItem.docketNumber,
    ).toEqual(mockWorkItem.docketNumber);
    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox.mock
        .calls[1][0].workItem.docketNumber,
    ).toEqual(MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber);
    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox.mock
        .calls[2][0].workItem.docketNumber,
    ).toEqual(MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber);
  });

  it('should set the document as served and update the case and work items for a generic order document', async () => {
    await fileDocumentOnOneCase(applicationContext, {
      clientConnectionId: 'testing',
      docketEntryId:
        MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[0].docketEntryId,
      docketNumbers: [MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber],
      form: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[0],
      subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
    });

    const updatedCase =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate;
    const updatedDocument = updatedCase.docketEntries.find(
      docketEntry =>
        docketEntry.docketEntryId ===
        MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[0].docketEntryId,
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

  it('should set the document as served and update the case and work items for a non-generic order document', async () => {
    await fileDocumentOnOneCase(applicationContext, {
      clientConnectionId,
      docketEntryId:
        MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[1].docketEntryId,
      docketNumbers: [MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber],
      form: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[1],
      subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
    });

    const updatedCase =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate;
    const updatedDocument = updatedCase.docketEntries.find(
      docketEntry =>
        docketEntry.docketEntryId ===
        MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[1].docketEntryId,
    );

    expect(updatedDocument.servedAt).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox,
    ).toHaveBeenCalled();
  });

  it('should use original case caption to create case title when creating work item', async () => {
    await fileDocumentOnOneCase(applicationContext, {
      clientConnectionId,
      docketEntryId:
        MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[1].docketEntryId,
      docketNumbers: [MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber],
      form: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[1],
      subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox.mock
        .calls[0][0].workItem,
    ).toMatchObject({
      caseTitle: Case.getCaseTitle(
        MOCK_LEAD_CASE_WITH_PAPER_SERVICE.caseCaption,
      ),
    });
  });

  it('should throw an error if there is no one on the case with electronic or paper service', async () => {
    const petitioners = [
      {
        ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE.petitioners[0],
        serviceIndicator: 'None',
      },
    ];

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce({
        ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
        petitioners,
      })
      .mockReturnValueOnce({
        ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
        petitioners,
      });

    await expect(
      fileDocumentOnOneCase(applicationContext, {
        clientConnectionId,
        docketEntryId:
          MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[0].docketEntryId,
        docketNumbers: [MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber],
        form: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[0],
        subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
      }),
    ).rejects.toThrow("servedPartiesCode' is not allowed to be empty");
  });

  it('should set the leadDocketNumber for work items', async () => {
    const leadDocketNumber = MOCK_CASE.docketNumber;
    const MOCK_LEAD_CASE_WITH_PAPER_SERVICEWithLeadDocketNumber = {
      ...MOCK_CASE,
      docketEntries: [mockDocketEntryWithWorkItem],
      leadDocketNumber,
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce(
        MOCK_LEAD_CASE_WITH_PAPER_SERVICEWithLeadDocketNumber,
      )
      .mockReturnValueOnce(
        MOCK_LEAD_CASE_WITH_PAPER_SERVICEWithLeadDocketNumber,
      );

    await fileDocumentOnOneCase(applicationContext, {
      clientConnectionId,
      docketEntryId:
        MOCK_LEAD_CASE_WITH_PAPER_SERVICEWithLeadDocketNumber.docketEntries[0]
          .docketEntryId,
      docketNumbers: [
        MOCK_LEAD_CASE_WITH_PAPER_SERVICEWithLeadDocketNumber.docketNumber,
      ],
      form: MOCK_LEAD_CASE_WITH_PAPER_SERVICEWithLeadDocketNumber
        .docketEntries[0],
      subjectCaseDocketNumber:
        MOCK_LEAD_CASE_WITH_PAPER_SERVICEWithLeadDocketNumber.docketNumber,
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
    MOCK_LEAD_CASE_WITH_PAPER_SERVICE.trialSessionId =
      'c54ba5a9-b37b-479d-9201-067ec6e335bb';
    MOCK_LEAD_CASE_WITH_PAPER_SERVICE.trialDate = '2019-03-01T21:40:46.415Z';

    await fileDocumentOnOneCase(applicationContext, {
      clientConnectionId,
      docketEntryId:
        MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[0].docketEntryId,
      docketNumbers: [MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber],
      form: {
        ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[0],
        eventCode: 'OD',
      },
      subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
  });

  it('should remove the case from the trial session if the case has a trialSessionId and isCalendared and the order document has an event code that should close the case', async () => {
    MOCK_LEAD_CASE_WITH_PAPER_SERVICE.trialSessionId =
      'c54ba5a9-b37b-479d-9201-067ec6e335bb';
    MOCK_LEAD_CASE_WITH_PAPER_SERVICE.trialDate = '2019-03-01T21:40:46.415Z';

    await fileDocumentOnOneCase(applicationContext, {
      clientConnectionId,
      docketEntryId:
        MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[0].docketEntryId,
      docketNumbers: [MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber],
      form: {
        ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[0],
        eventCode: 'OD',
      },
      subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
  });

  it('should call updateCaseAutomaticBlock and deleteCaseTrialSortMappingRecords if the order document has an event code that should close the case', async () => {
    await fileDocumentOnOneCase(applicationContext, {
      clientConnectionId: 'testing',
      docketEntryId:
        MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[0].docketEntryId,
      docketNumbers: [MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber],
      form: {
        ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[0],
        eventCode: 'OD',
      },
      subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAutomaticBlock,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toHaveBeenCalled();
  });

  it('should set isDraft to false on a document when creating a court issued docket entry', async () => {
    await fileDocumentOnOneCase(applicationContext, {
      clientConnectionId,
      docketEntryId:
        MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[2].docketEntryId,
      docketNumbers: [MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber],
      form: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[2],
      subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
    });

    const newlyFiledDocument =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries[2];

    expect(newlyFiledDocument).toMatchObject({
      isDraft: false,
    });
  });

  it('should update the work item and set as completed when a work item previously existed on the docket entry', async () => {
    await fileDocumentOnOneCase(applicationContext, {
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
    await fileDocumentOnOneCase(applicationContext, {
      clientConnectionId: 'testing',
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

  const docketEntriesWithCaseClosingEventCodes =
    ENTERED_AND_SERVED_EVENT_CODES.map(eventCode => {
      const eventCodeMap = COURT_ISSUED_EVENT_CODES.find(
        entry => entry.eventCode === eventCode,
      );

      return {
        docketEntryId: uuidv4(),
        docketNumber: MOCK_CASE.docketNumber,
        documentType: eventCodeMap.documentType,
        eventCode,
        signedAt: createISODateString(),
        signedByUserId: uuidv4(),
        signedJudgeName: 'Chief Judge',
        userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
        workItem: mockWorkItem,
      };
    });

  docketEntriesWithCaseClosingEventCodes.forEach(docketEntry => {
    it(`should set the case status to closed for event code: ${docketEntry.eventCode}`, async () => {
      await fileDocumentOnOneCase(applicationContext, {
        clientConnectionId,
        docketEntryId:
          MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[0].docketEntryId,
        docketNumbers: [MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber],
        form: {
          ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[0],
          eventCode: docketEntry.eventCode,
        },
        subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
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

  it('should call updateCase with the docket entry set as pending if the document is a tracked document', async () => {
    await fileDocumentOnOneCase(applicationContext, {
      clientConnectionId,
      docketEntryId:
        MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[1].docketEntryId,
      docketNumbers: [MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber],
      form: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[1],
      subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    const { caseToUpdate } =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0];
    const docketEntryInCaseToUpdate = caseToUpdate.docketEntries.find(
      d =>
        d.docketEntryId ===
        MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[1].docketEntryId,
    );
    expect(docketEntryInCaseToUpdate).toMatchObject({
      docketEntryId:
        MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketEntries[1].docketEntryId,
      pending: true,
    });
  });
});
