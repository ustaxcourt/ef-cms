const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const {
  DOCKET_SECTION,
  TRANSCRIPT_EVENT_CODE,
} = require('../../entities/EntityConstants');
const {
  ENTERED_AND_SERVED_EVENT_CODES,
} = require('../../entities/courtIssuedDocument/CourtIssuedDocumentConstants');
const {
  fileAndServeCourtIssuedDocumentInteractor,
} = require('./fileAndServeCourtIssuedDocumentInteractor');
const {
  MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE,
  MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE,
  MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
} = require('../../../test/mockCase');
const { Case } = require('../../entities/cases/Case');
const { cloneDeep } = require('lodash');
const { docketClerkUser } = require('../../../test/mockUsers');
const { MOCK_DOCUMENTS } = require('../../../test/mockDocuments');
const { v4: uuidv4 } = require('uuid');

describe('consolidated cases', () => {
  const mockPdfUrl = 'www.example.com';
  const mockWorkItem = {
    docketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
    section: DOCKET_SECTION,
    sentBy: docketClerkUser.name,
    sentByUserId: docketClerkUser.userId,
    workItemId: 'b4c7337f-9ca0-45d9-9396-75e003f81e32',
  };

  const mockDocketEntryWithWorkItem = {
    docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
    docketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
    documentTitle: 'Order',
    documentType: 'Order',
    eventCode: 'O',
    signedAt: '2019-03-01T21:40:46.415Z',
    signedByUserId: docketClerkUser.userId,
    signedJudgeName: 'Dredd',
    userId: docketClerkUser.userId,
    workItem: mockWorkItem,
  };

  const clientConnectionId = 'ABC123';

  let updateDocketEntrySpy;
  let addDocketEntrySpy;
  let leadCaseDocketEntries;
  let consolidatedCase1DocketEntries;

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

    // CONSOLIDATED_CASES_PROPAGATE_DOCKET_ENTRIES
    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockReturnValue(Promise.resolve(true));

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

    updateDocketEntrySpy = jest.spyOn(Case.prototype, 'updateDocketEntry');
    addDocketEntrySpy = jest.spyOn(Case.prototype, 'addDocketEntry');

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

  it('should call serveDocumentAndGetPaperServicePdf and pass the resulting url and success message to `sendNotificationToUser` along with the `clientConnectionId`', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(
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
      clientConnectionId,
    );

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
        action: 'file_and_serve_court_issued_document_complete',
        alertSuccess: {
          message: 'Document served to selected cases in group. ',
          overwritable: false,
        },
        pdfUrl: mockPdfUrl,
      }),
      userId: docketClerkUser.userId,
    });

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
    const expectedErrorString = 'expected error';

    applicationContext
      .getPersistenceGateway()
      .saveWorkItem.mockImplementationOnce(() => {})
      .mockImplementationOnce(() => {})
      .mockRejectedValueOnce(new Error(expectedErrorString));

    await expect(
      fileAndServeCourtIssuedDocumentInteractor(
        applicationContext,
        {
          docketEntryId: leadCaseDocketEntries[0].docketEntryId,
          docketNumbers: [
            MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
            MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
            MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
          ],
          form: leadCaseDocketEntries[0],
          subjectCaseDocketNumber:
            MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
        },
        clientConnectionId,
      ),
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
          docketEntries: leadCaseDocketEntries,
        };
      })
      .mockImplementationOnce(() => {
        return {
          ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
          docketEntries: leadCaseDocketEntries,
        };
      })
      .mockRejectedValueOnce(new Error(expectedErrorString));

    const innerError = new Error('something else');

    applicationContext
      .getPersistenceGateway()
      .updateDocketEntryPendingServiceStatus.mockImplementationOnce(() => {})
      .mockRejectedValueOnce(innerError);

    await expect(
      fileAndServeCourtIssuedDocumentInteractor(
        applicationContext,
        {
          docketEntryId: leadCaseDocketEntries[0].docketEntryId,
          docketNumbers: [
            MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
            MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
            MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
          ],
          form: leadCaseDocketEntries[0],
          subjectCaseDocketNumber:
            MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
        },
        clientConnectionId,
      ),
    ).rejects.toThrow(expectedErrorString);

    expect(applicationContext.logger.error).toBeCalledTimes(1);
    expect(applicationContext.logger.error.mock.calls[0][1]).toEqual(
      innerError,
    );
  });

  it('should only close and serve the lead case when serving ENTERED_AND_SERVED_EVENT_CODES', async () => {
    const customLeadCaseDocketEntries = cloneDeep(leadCaseDocketEntries);
    customLeadCaseDocketEntries[0].eventCode =
      ENTERED_AND_SERVED_EVENT_CODES[0];

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementationOnce(() => {
        return {
          ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
          docketEntries: customLeadCaseDocketEntries,
        };
      })
      .mockImplementationOnce(() => {
        return {
          ...MOCK_LEAD_CASE_WITH_PAPER_SERVICE,
          docketEntries: customLeadCaseDocketEntries,
        };
      });

    await fileAndServeCourtIssuedDocumentInteractor(
      applicationContext,
      {
        docketEntryId: customLeadCaseDocketEntries[0].docketEntryId,
        docketNumbers: [
          MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
          MOCK_CONSOLIDATED_1_CASE_WITH_PAPER_SERVICE.docketNumber,
          MOCK_CONSOLIDATED_2_CASE_WITH_PAPER_SERVICE.docketNumber,
        ],
        form: customLeadCaseDocketEntries[0],
        subjectCaseDocketNumber: MOCK_LEAD_CASE_WITH_PAPER_SERVICE.docketNumber,
      },
      clientConnectionId,
    );
    
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
    await fileAndServeCourtIssuedDocumentInteractor(
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
      clientConnectionId,
    );

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

  it('should create a single source of truth for the document by saving only one copy', async () => {
    await fileAndServeCourtIssuedDocumentInteractor(
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
      clientConnectionId,
    );

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toBeCalledTimes(1);
  });

  // CONSOLIDATED_CASES_PROPAGATE_DOCKET_ENTRIES
  it('should only process the subject case when the feature flag is disabled and there are other consolidated cases', async () => {
    applicationContext
      .getUseCases()
      .getFeatureFlagValueInteractor.mockReturnValueOnce(
        Promise.resolve(false),
      );

    await fileAndServeCourtIssuedDocumentInteractor(
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
      clientConnectionId,
    );

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAndAssociations,
    ).toHaveBeenCalledTimes(1);

    expect(updateDocketEntrySpy).toHaveBeenCalledTimes(1);
    expect(addDocketEntrySpy).toHaveBeenCalledTimes(0);
  });
});
