const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const {
  AUTOMATIC_BLOCKED_REASONS,
  CASE_STATUS_TYPES,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  COURT_ISSUED_EVENT_CODES,
  DOCKET_SECTION,
  PARTY_TYPES,
  ROLES,
  TRIAL_SESSION_PROCEEDING_TYPES,
} = require('../../entities/EntityConstants');
const {
  ENTERED_AND_SERVED_EVENT_CODES,
} = require('../../entities/courtIssuedDocument/CourtIssuedDocumentConstants');
const {
  serveCourtIssuedDocumentInteractor,
} = require('./serveCourtIssuedDocumentInteractor');
const { createISODateString } = require('../../utilities/DateHandler');
const { docketClerkUser } = require('../../../test/mockUsers');
const { MOCK_CASE } = require('../../../test/mockCase');
const { v4: uuidv4 } = require('uuid');

describe('serveCourtIssuedDocumentInteractor', () => {
  let extendCase;
  let mockTrialSession;

  const mockDocketEntryId = 'cf105788-5d34-4451-aa8d-dfd9a851b675';
  const mockServedDocketEntryId = '736a68f4-d08d-4ba1-8185-117359f46804';

  const mockPdfUrl = 'www.example.com';

  const mockWorkItem = {
    docketNumber: MOCK_CASE.docketNumber,
    section: DOCKET_SECTION,
    sentBy: docketClerkUser.name,
    sentByUserId: docketClerkUser.userId,
    workItemId: 'b4c7337f-9ca0-45d9-9396-75e003f81e32',
  };

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

  const mockCases = [
    {
      ...MOCK_CASE,
      docketEntries: [
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          docketNumber: MOCK_CASE.docketNumber,
          documentType: 'Order',
          eventCode: 'O',
          serviceStamp: 'Served',
          signedAt: createISODateString(),
          signedByUserId: uuidv4(),
          signedJudgeName: 'Chief Judge',
          userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
          workItem: mockWorkItem,
        },
        {
          docketEntryId: mockDocketEntryId,
          docketNumber: MOCK_CASE.docketNumber,
          documentType: 'Order that case is assigned',
          eventCode: 'OAJ',
          signedAt: createISODateString(),
          signedByUserId: uuidv4(),
          signedJudgeName: 'Chief Judge',
          userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
          workItem: mockWorkItem,
        },
        {
          docketEntryId: mockServedDocketEntryId,
          docketNumber: MOCK_CASE.docketNumber,
          documentType: 'Order that case is assigned',
          eventCode: 'OAJ',
          servedAt: createISODateString(),
          servedParties: [
            {
              name: 'Bernard Lowe',
            },
          ],
          signedAt: createISODateString(),
          signedByUserId: uuidv4(),
          signedJudgeName: 'Chief Judge',
          userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
          workItem: mockWorkItem,
        },
        ...docketEntriesWithCaseClosingEventCodes,
      ],
    },
    {
      ...MOCK_CASE,
      docketEntries: [
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          docketNumber: '102-20',
          documentType: 'Order',
          eventCode: 'O',
          pending: true,
          serviceStamp: 'Served',
          signedAt: createISODateString(),
          signedByUserId: uuidv4(),
          signedJudgeName: 'Chief Judge',
          userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
          workItem: mockWorkItem,
        },
        {
          docketEntryId: mockDocketEntryId,
          docketNumber: '102-20',
          documentType: 'Order that case is assigned',
          eventCode: 'OAJ',
          signedAt: createISODateString(),
          signedByUserId: uuidv4(),
          signedJudgeName: 'Chief Judge',
          userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
          workItem: mockWorkItem,
        },
        ...docketEntriesWithCaseClosingEventCodes,
      ],
      docketNumber: '102-20',
      partyType: PARTY_TYPES.petitionerSpouse,
      petitioners: [
        ...MOCK_CASE.petitioners,
        {
          address1: '123 Main St',
          city: 'Somewhere',
          contactType: CONTACT_TYPES.secondary,
          countryType: COUNTRY_TYPES.DOMESTIC,
          name: 'Contact Secondary',
          phone: '123123134',
          postalCode: '12345',
          state: 'TN',
        },
      ],
    },
  ];

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .saveDocumentFromLambda.mockImplementation(() => {});

    applicationContext.logger.error.mockImplementation(() => {});

    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockResolvedValue(1);

    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: () => ({
        Body: testPdfDoc,
      }),
    });

    applicationContext
      .getPersistenceGateway()
      .putWorkItemInUsersOutbox.mockImplementation(() => {});

    applicationContext
      .getPersistenceGateway()
      .saveWorkItem.mockImplementation(() => {});

    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockReturnValue({
        pdfUrl: mockPdfUrl,
      });
  });

  beforeEach(() => {
    extendCase = {};

    applicationContext.getCurrentUser.mockImplementation(() => docketClerkUser);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockImplementation(({ docketNumber }) => {
        const theCase = mockCases.find(
          mockCase => mockCase.docketNumber === docketNumber,
        );
        if (theCase) {
          return {
            ...theCase,
            ...extendCase,
          };
        } else return {};
      });

    mockTrialSession = {
      caseOrder: [
        {
          docketNumber: mockCases[0].docketNumber,
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
  });

  it('should throw an Unauthorized error if the user role does not have the SERVE_DOCUMENT permission', async () => {
    // petitioner role does NOT have the SERVE_DOCUMENT permission
    const user = { ...docketClerkUser, role: ROLES.petitioner };
    applicationContext.getCurrentUser.mockReturnValue(user);

    await expect(
      serveCourtIssuedDocumentInteractor(applicationContext, {
        docketEntryId: '000',
        docketNumber: mockCases[0].docketNumber,
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw a Not Found error if the case can not be found', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValueOnce({});

    await expect(
      serveCourtIssuedDocumentInteractor(applicationContext, {
        docketEntryId: '000',
        docketNumbers: ['000-00'],
        subjectCaseDocketNumber: '000-00',
      }),
    ).rejects.toThrow('Case 000-00 was not found');
  });

  it('should throw a Not Found error if the document can not be found', async () => {
    await expect(
      serveCourtIssuedDocumentInteractor(applicationContext, {
        docketEntryId: '000',
        docketNumbers: [mockCases[0].docketNumber],
        subjectCaseDocketNumber: mockCases[0].docketNumber,
      }),
    ).rejects.toThrow('Docket entry 000 was not found');
  });

  it('should throw an error if the docket entry has already been served', async () => {
    await expect(
      serveCourtIssuedDocumentInteractor(applicationContext, {
        docketEntryId: mockServedDocketEntryId,
        docketNumbers: [mockCases[0].docketNumber],
        subjectCaseDocketNumber: mockCases[0].docketNumber,
      }),
    ).rejects.toThrow('Docket entry has already been served');
  });

  it('should set the document as served and update the case and work items for a generic order document', async () => {
    await serveCourtIssuedDocumentInteractor(applicationContext, {
      docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
      docketNumbers: [mockCases[0].docketNumber],
      subjectCaseDocketNumber: mockCases[0].docketNumber,
    });

    const updatedCase =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate;
    const updatedDocument = updatedCase.docketEntries.find(
      docketEntry =>
        docketEntry.docketEntryId === 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
    );

    expect(updatedDocument.servedAt).toBeDefined();
    expect(updatedDocument.filingDate).toBeDefined();
    expect(updatedDocument.leadDocketNumber).not.toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox,
    ).toHaveBeenCalled();
  });

  it('should set the number of pages present in the document to be served', async () => {
    await serveCourtIssuedDocumentInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
      docketNumbers: [mockCases[0].docketNumber],
      subjectCaseDocketNumber: mockCases[0].docketNumber,
    });

    const updatedCase =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate;
    const updatedDocument = updatedCase.docketEntries.find(
      docketEntry => docketEntry.docketEntryId === mockDocketEntryId,
    );

    expect(updatedDocument.numberOfPages).toBe(1);
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument.mock
        .calls[0][0],
    ).toMatchObject({ docketEntryId: mockDocketEntryId });
  });

  it('should set the document as served and update the case and work items for a non-generic order document', async () => {
    await serveCourtIssuedDocumentInteractor(applicationContext, {
      docketEntryId: mockDocketEntryId,
      docketNumbers: [mockCases[0].docketNumber],
      subjectCaseDocketNumber: mockCases[0].docketNumber,
    });

    const updatedCase =
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate;
    const updatedDocument = updatedCase.docketEntries.find(
      docketEntry => docketEntry.docketEntryId === mockDocketEntryId,
    );

    expect(updatedDocument.servedAt).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItem,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().putWorkItemInUsersOutbox,
    ).toHaveBeenCalled();
  });

  it('should call updateCaseAutomaticBlock and mark the case as automaticBlocked if the docket entry is pending', async () => {
    await serveCourtIssuedDocumentInteractor(applicationContext, {
      docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
      docketNumbers: [mockCases[1].docketNumber],
      subjectCaseDocketNumber: mockCases[1].docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().updateCaseAutomaticBlock,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pending,
    });
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toBeCalled();
  });

  it('should remove the case from the trial session if the case has a trialSessionId and trialSession is calendared', async () => {
    extendCase.trialSessionId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';
    extendCase.trialDate = '2019-11-27T05:00:00.000Z';

    await serveCourtIssuedDocumentInteractor(applicationContext, {
      docketEntryId: docketEntriesWithCaseClosingEventCodes[0].docketEntryId,
      docketNumbers: [mockCases[0].docketNumber],
      subjectCaseDocketNumber: mockCases[0].docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).toHaveBeenCalled();

    const updatedTrialSession =
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate;
    expect(updatedTrialSession.caseOrder[0].disposition).toEqual(
      'Status was changed to Closed',
    );
  });

  it('should delete the case from the trial session if the case has a trialSessionId and trialSession is not calendared', async () => {
    mockTrialSession.isCalendared = false;

    extendCase.trialSessionId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';
    extendCase.trialDate = '2019-11-27T05:00:00.000Z';

    await serveCourtIssuedDocumentInteractor(applicationContext, {
      docketEntryId: docketEntriesWithCaseClosingEventCodes[0].docketEntryId,
      docketNumbers: [mockCases[0].docketNumber],
      subjectCaseDocketNumber: mockCases[0].docketNumber,
    });

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).toHaveBeenCalled();

    const updatedTrialSession =
      applicationContext.getPersistenceGateway().updateTrialSession.mock
        .calls[0][0].trialSessionToUpdate;
    expect(updatedTrialSession.caseOrder.length).toEqual(0);
  });

  docketEntriesWithCaseClosingEventCodes.forEach(docketEntry => {
    it(`should set the case status to closed for event code: ${docketEntry.eventCode}`, async () => {
      await serveCourtIssuedDocumentInteractor(applicationContext, {
        docketEntryId: docketEntry.docketEntryId,
        docketNumbers: [mockCases[0].docketNumber],
        subjectCaseDocketNumber: mockCases[0].docketNumber,
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

  it('should throw an error if the document is already pending service', async () => {
    mockCases[0].docketEntries[0].isPendingService = true;

    await expect(
      serveCourtIssuedDocumentInteractor(applicationContext, {
        docketEntryId: mockCases[0].docketEntries[0].docketEntryId,
        docketNumbers: [mockCases[0].docketNumber],
        subjectCaseDocketNumber: mockCases[0].docketNumber,
      }),
    ).rejects.toThrow('Docket entry is already being served');

    expect(
      applicationContext.getUseCaseHelpers().serveDocumentAndGetPaperServicePdf,
    ).not.toHaveBeenCalled();
  });

  it('should call the persistence method to set and unset the pending service status on the document', async () => {
    const docketEntry = mockCases[0].docketEntries[0];
    docketEntry.isPendingService = false;

    await serveCourtIssuedDocumentInteractor(applicationContext, {
      docketEntryId: docketEntry.docketEntryId,
      docketNumbers: [mockCases[0].docketNumber],
      subjectCaseDocketNumber: mockCases[0].docketNumber,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketEntryId: docketEntry.docketEntryId,
      docketNumber: mockCases[0].docketNumber,
      status: true,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketEntryId: docketEntry.docketEntryId,
      docketNumber: mockCases[0].docketNumber,
      status: false,
    });
  });

  it('should call the persistence method to unset the pending service status on the document if there is an error when serving', async () => {
    const docketEntry = mockCases[0].docketEntries[0];
    docketEntry.isPendingService = false;

    applicationContext
      .getUseCaseHelpers()
      .serveDocumentAndGetPaperServicePdf.mockRejectedValueOnce(
        new Error('whoops, that is an error!'),
      );

    await expect(
      serveCourtIssuedDocumentInteractor(applicationContext, {
        docketEntryId: docketEntry.docketEntryId,
        docketNumbers: [mockCases[0].docketNumber],
        subjectCaseDocketNumber: mockCases[0].docketNumber,
      }),
    ).rejects.toThrow('whoops, that is an error!');

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketEntryId: docketEntry.docketEntryId,
      docketNumber: mockCases[0].docketNumber,
      status: true,
    });

    expect(
      applicationContext.getPersistenceGateway()
        .updateDocketEntryPendingServiceStatus,
    ).toHaveBeenCalledWith({
      applicationContext,
      docketEntryId: docketEntry.docketEntryId,
      docketNumber: mockCases[0].docketNumber,
      status: false,
    });
  });
});
