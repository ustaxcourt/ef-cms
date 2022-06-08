/* eslint-disable max-lines */
const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const {
  DOCKET_SECTION,

  TRANSCRIPT_EVENT_CODE,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const {
  ENTERED_AND_SERVED_EVENT_CODES,
} = require('../../entities/courtIssuedDocument/CourtIssuedDocumentConstants');
const {
  fileAndServeCourtIssuedDocumentInteractor,
} = require('./fileAndServeCourtIssuedDocumentInteractor');
const {
  MOCK_CASE,
  MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
  MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE,
  MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
} = require('../../../test/mockCase');
const { Case } = require('../../entities/cases/Case');
const { docketClerkUser } = require('../../../test/mockUsers');
const { MOCK_DOCUMENTS } = require('../../../test/mockDocuments');
const { v4: uuidv4 } = require('uuid');

jest.mock('./addServedStampToDocument', () => ({
  addServedStampToDocument: jest.fn(),
}));

describe('consolidated cases', () => {
  // old code from previous describe

  let caseRecord;
  let mockTrialSession;
  const mockPdfUrl = 'www.example.com';
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

  // const docketEntriesWithCaseClosingEventCodes =
  //   ENTERED_AND_SERVED_EVENT_CODES.map(eventCode => {
  //     const eventCodeMap = COURT_ISSUED_EVENT_CODES.find(
  //       entry => entry.eventCode === eventCode,
  //     );

  //     return {
  //       docketEntryId: uuidv4(),
  //       documentType: eventCodeMap.documentType,
  //       eventCode,
  //       signedAt: createISODateString(),
  //       signedByUserId: uuidv4(),
  //       signedJudgeName: 'Chief Judge',
  //       userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
  //       workItem: mockWorkItem,
  //     };
  //   });

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
      createdAt: '2019-10-27T05:00:00.000Z',
      gsi1pk: 'trial-session-catalog',
      isCalendared: true,
      judge: {
        name: 'Judge Colvin',
        userId: 'dabbad00-18d0-43ec-bafb-654e83405416',
      },
      maxCases: 100,
      pk: 'trial-session|959c4338-0fac-42eb-b0eb-d53b8d0195cc',
      proceedingType: TRIAL_SESSION_PROCEEDING_TYPES.inPerson,
      sessionType: 'Regular',
      sk: 'trial-session|959c4338-0fac-42eb-b0eb-d53b8d0195cc',
      startDate: '2019-11-27T05:00:00.000Z',
      startTime: '10:00',
      swingSession: true,
      swingSessionId: '208a959f-9526-4db5-b262-e58c476a4604',
      term: 'Fall',
      termYear: '2019',
      trialLocation: 'Houston, Texas',
      trialSessionId: '959c4338-0fac-42eb-b0eb-d53b8d0195cc',
    };
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue(mockTrialSession);

    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockReturnValue(1);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(() => caseRecord);

    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => ({
        Body: testPdfDoc,
      }),
    });

    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockReturnValue(true);
  });
  //new
  let updateDocketEntrySpy;
  let addDocketEntrySpy;
  let leadCaseDocketEntries;
  let consolidatedCase1DocketEntries;

  beforeEach(() => {
    leadCaseDocketEntries = caseRecord.docketEntries.map(docketEntry => {
      return {
        ...docketEntry,
        docketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
      };
    });
    consolidatedCase1DocketEntries = MOCK_DOCUMENTS.map(docketEntry => {
      return {
        ...docketEntry,
        docketEntryId: uuidv4(),
        docketNumber: MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
      };
    });

    updateDocketEntrySpy = jest.spyOn(Case.prototype, 'updateDocketEntry');
    addDocketEntrySpy = jest.spyOn(Case.prototype, 'addDocketEntry');

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
        if (docketNumber === MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber) {
          return {
            ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
            docketEntries: leadCaseDocketEntries,
          };
        } else if (
          docketNumber ===
          MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber
        ) {
          return {
            ...MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
            docketEntries: consolidatedCase1DocketEntries,
          };
        } else if (
          docketNumber ===
          MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber
        ) {
          return {
            ...MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE,
            docketEntries: [],
          };
        } else {
          return caseRecord;
        }
      });

    applicationContext
      .getPersistenceGateway()
      .saveWorkItem.mockImplementation(() => {});
  });

  it('should call serveDocumentAndGetPaperServicePdf and return its result', async () => {
    const result = await fileAndServeCourtIssuedDocumentInteractor(
      applicationContext,
      {
        docketEntryId: leadCaseDocketEntries[0].docketEntryId,
        docketNumbers: [
          MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
          MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
          MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
        ],
        form: leadCaseDocketEntries[0],
        subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
      },
    );

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).toHaveBeenCalled();
    expect(result.pdfUrl).toBe(mockPdfUrl);

    expect(updateDocketEntrySpy).toHaveBeenCalledTimes(1);
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
    ).toBeCalledTimes(finallyBlockCalls + initialCall);
  });

  it('should call updateDocketEntryPendingServiceStatus on error', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementationOnce(() => {
        return {
          ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
          docketEntries: caseRecord.docketEntries,
        };
      })
      .mockImplementationOnce(() => {
        return {
          ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
          docketEntries: caseRecord.docketEntries,
        };
      })
      .mockImplementationOnce(() => {
        return MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE;
      })
      .mockImplementationOnce(() => {
        return MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE;
      });

    const expectedErrorString = 'expected error';

    applicationContext
      .getPersistenceGateway()
      .saveWorkItem.mockImplementation(({ workItem }) => {
        if (
          workItem.docketNumber ===
          MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber
        ) {
          throw new Error(expectedErrorString);
        }
      });

    await expect(
      fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
        docketEntryId: caseRecord.docketEntries[0].docketEntryId,
        docketNumbers: [
          MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
          MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
          MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
        ],
        form: caseRecord.docketEntries[0],
        subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
      }),
    ).rejects.toThrow(expectedErrorString);

    const initialCall = 1;
    const finallyBlockCalls = 3;

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toBeCalledTimes(finallyBlockCalls + initialCall);
  });

  it('should log the failure to call updateDocketEntryPendingServiceStatus in the finally block', async () => {
    const expectedErrorString = 'expected error';

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementationOnce(() => {
        return {
          ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
          docketEntries: caseRecord.docketEntries,
        };
      })
      .mockImplementationOnce(() => {
        return {
          ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
          docketEntries: caseRecord.docketEntries,
        };
      })
      .mockRejectedValueOnce(new Error(expectedErrorString));

    const innerError = new Error('something else');

    applicationContext
      .getPersistenceGateway()
      .updateDocketEntryPendingServiceStatus.mockImplementationOnce(() => {})
      .mockRejectedValueOnce(innerError);

    await expect(
      fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
        docketEntryId: caseRecord.docketEntries[0].docketEntryId,
        docketNumbers: [
          MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
          MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
          MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
        ],
        form: caseRecord.docketEntries[0],
        subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
      }),
    ).rejects.toThrow(expectedErrorString);

    expect(applicationContext.logger.error).toBeCalledTimes(1);
    expect(applicationContext.logger.error.mock.calls[0][1]).toEqual(
      innerError,
    );
  });

  it('should only close and serve the lead case when serving ENTERED_AND_SERVED_EVENT_CODES', async () => {
    leadCaseDocketEntries[0].eventCode = ENTERED_AND_SERVED_EVENT_CODES[0];

    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
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
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toHaveBeenCalledTimes(1);

    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords.mock.calls[0][0].docketNumber,
    ).toEqual(MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber);

    expect(updateDocketEntrySpy).toHaveBeenCalledTimes(1);
    expect(addDocketEntrySpy).toHaveBeenCalledTimes(0);
  });

  it('should create a work item and add it to the outbox for each case', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
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
    ).toEqual(mockWorkItem.docketNumber);
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

  it('should create a single source of truth for the document by saving only one copy', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(applicationContext, {
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
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toBeCalledTimes(1);
  });

  //TODO: assert that we only process one case when the feature flag is disabled
});
