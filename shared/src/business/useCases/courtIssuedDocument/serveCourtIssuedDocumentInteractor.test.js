const {
  applicationContext,
  testPdfDoc,
} = require('../../test/createTestApplicationContext');
const {
  AUTOMATIC_BLOCKED_REASONS,
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  COURT_ISSUED_EVENT_CODES,
  DOCKET_SECTION,
  PARTY_TYPES,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  ENTERED_AND_SERVED_EVENT_CODES,
} = require('../../entities/courtIssuedDocument/CourtIssuedDocumentConstants');
const {
  serveCourtIssuedDocumentInteractor,
} = require('./serveCourtIssuedDocumentInteractor');
const { createISODateString } = require('../../utilities/DateHandler');
const { v4: uuidv4 } = require('uuid');

describe('serveCourtIssuedDocumentInteractor', () => {
  let extendCase;

  const mockPdfUrl = 'www.example.com';
  const mockDocketEntryId = 'cf105788-5d34-4451-aa8d-dfd9a851b675';

  const mockUser = {
    name: 'Docket Clerk',
    role: ROLES.docketClerk,
    userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
  };

  const mockWorkItem = {
    docketNumber: '101-20',
    section: DOCKET_SECTION,
    sentBy: mockUser.name,
    sentByUserId: mockUser.userId,
    workItemId: 'b4c7337f-9ca0-45d9-9396-75e003f81e32',
  };

  const dynamicallyGeneratedDocketEntries = [];
  const docketEntriesWithCaseClosingEventCodes = ENTERED_AND_SERVED_EVENT_CODES.map(
    eventCode => {
      const docketEntryId = uuidv4();
      const docketRecordId = uuidv4();

      const index = dynamicallyGeneratedDocketEntries.length + 2; // 2 statically set docket records per case;

      dynamicallyGeneratedDocketEntries.push({
        docketEntryId,
        docketRecordId,
        documentTitle: `Docket Record ${index}`,
        eventCode: 'O',
        filingDate: createISODateString(),
        index,
      });

      const eventCodeMap = COURT_ISSUED_EVENT_CODES.find(
        entry => entry.eventCode === eventCode,
      );

      return {
        docketEntryId,
        documentType: eventCodeMap.documentType,
        eventCode,
        signedAt: createISODateString(),
        signedByUserId: uuidv4(),
        signedJudgeName: 'Chief Judge',
        userId: '2474e5c0-f741-4120-befa-b77378ac8bf0',
        workItem: mockWorkItem,
      };
    },
  );

  const mockCases = [
    {
      caseCaption: 'Caption',
      caseType: CASE_TYPES_MAP.deficiency,
      contactPrimary: {
        address1: '123 Main St',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'contact@example.com',
        name: 'Contact Primary',
        phone: '123123134',
        postalCode: '12345',
        state: 'TN',
      },
      docketEntries: [
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
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
      docketNumber: '101-20',
      filingType: 'Myself',
      partyType: PARTY_TYPES.petitioner,
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
      userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
    },
    {
      caseCaption: 'Caption',
      caseType: CASE_TYPES_MAP.deficiency,
      contactPrimary: {
        address1: '123 Main St',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Contact Primary',
        phone: '123123134',
        postalCode: '12345',
        state: 'TN',
      },
      contactSecondary: {
        address1: '123 Main St',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        name: 'Contact Secondary',
        phone: '123123134',
        postalCode: '12345',
        state: 'TN',
      },
      docketEntries: [
        {
          docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
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
      filingType: 'Myself',
      isPaper: true,
      mailingDate: 'testing',
      partyType: PARTY_TYPES.petitionerSpouse,
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
      userId: 'e8577e31-d6d5-4c4a-adc6-520075f3dde5',
    },
  ];

  beforeEach(() => {
    extendCase = {};

    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
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
        }
      });
    applicationContext
      .getPersistenceGateway()
      .getDownloadPolicyUrl.mockReturnValue(mockPdfUrl);
    applicationContext
      .getPersistenceGateway()
      .updateCase.mockImplementation(caseToUpdate => caseToUpdate);
    applicationContext
      .getUseCaseHelpers()
      .countPagesInDocument.mockResolvedValue(1);
    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: async () => ({
        Body: testPdfDoc,
      }),
    });
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
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
      });
    applicationContext
      .getPersistenceGateway()
      .putWorkItemInOutbox.mockImplementation(() => {});
  });

  it('should throw an Unauthorized error if the user role does not have the SERVE_DOCUMENT permission', async () => {
    // petitioner role does NOT have the SERVE_DOCUMENT permission
    const user = { ...mockUser, role: ROLES.petitioner };
    applicationContext.getCurrentUser.mockReturnValue(user);

    await expect(
      serveCourtIssuedDocumentInteractor({
        applicationContext,
        docketEntryId: '000',
        docketNumber: '101-20',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw a Not Found error if the case can not be found', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(null);

    await expect(
      serveCourtIssuedDocumentInteractor({
        applicationContext,
        docketEntryId: '000',
        docketNumber: '000-00',
      }),
    ).rejects.toThrow('Case 000-00 was not found');
  });

  it('should throw a Not Found error if the document can not be found', async () => {
    await expect(
      serveCourtIssuedDocumentInteractor({
        applicationContext,
        docketEntryId: '000',
        docketNumber: '101-20',
      }),
    ).rejects.toThrow('Docket entry 000 was not found');
  });

  it('should set the document as served and update the case and work items for a generic order document', async () => {
    await serveCourtIssuedDocumentInteractor({
      applicationContext,
      docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
      docketNumber: '101-20',
    });

    const updatedCase = applicationContext.getPersistenceGateway().updateCase
      .mock.calls[0][0].caseToUpdate;
    const updatedDocument = updatedCase.docketEntries.find(
      document =>
        document.docketEntryId === 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
    );

    expect(updatedDocument.servedAt).toBeDefined();
    expect(updatedDocument.filingDate).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().deleteWorkItemFromInbox,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().putWorkItemInOutbox,
    ).toHaveBeenCalled();
  });

  it('should set the number of pages present in the document to be served', async () => {
    await serveCourtIssuedDocumentInteractor({
      applicationContext,
      docketEntryId: mockDocketEntryId,
      docketNumber: '101-20',
    });

    const updatedCase = applicationContext.getPersistenceGateway().updateCase
      .mock.calls[0][0].caseToUpdate;
    const updatedDocument = updatedCase.docketEntries.find(
      document => document.docketEntryId === mockDocketEntryId,
    );

    expect(updatedDocument.numberOfPages).toBe(1);
    expect(
      applicationContext.getUseCaseHelpers().countPagesInDocument.mock
        .calls[0][0],
    ).toMatchObject({ docketEntryId: mockDocketEntryId });
  });

  it('should set the document as served and update the case and work items for a non-generic order document', async () => {
    applicationContext
      .getPersistenceGateway()
      .saveDocumentFromLambda.mockImplementation(() => {});

    await serveCourtIssuedDocumentInteractor({
      applicationContext,
      docketEntryId: mockDocketEntryId,
      docketNumber: '101-20',
    });

    const updatedCase = applicationContext.getPersistenceGateway().updateCase
      .mock.calls[0][0].caseToUpdate;
    const updatedDocument = updatedCase.docketEntries.find(
      document => document.docketEntryId === mockDocketEntryId,
    );

    expect(updatedDocument.servedAt).toBeDefined();
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().deleteWorkItemFromInbox,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().putWorkItemInOutbox,
    ).toHaveBeenCalled();
  });

  it('should call sendBulkTemplatedEmail, sending an email to all electronically-served parties, and should not return paperServicePdfData', async () => {
    const result = await serveCourtIssuedDocumentInteractor({
      applicationContext,
      docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
      docketNumber: '101-20',
    });

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it('should return paperServicePdfData when there are paper service parties on the case', async () => {
    const result = await serveCourtIssuedDocumentInteractor({
      applicationContext,
      docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
      docketNumber: '102-20',
    });

    expect(result.pdfUrl).toBe(mockPdfUrl.url);
  });

  it('should call updateCaseAutomaticBlock and mark the case as automaticBlocked if the docket entry is pending', async () => {
    await serveCourtIssuedDocumentInteractor({
      applicationContext,
      docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
      docketNumber: '102-20',
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

  it('should remove the case from the trial session if the case has a trialSessionId', async () => {
    extendCase.trialSessionId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';

    await serveCourtIssuedDocumentInteractor({
      applicationContext,
      docketEntryId: docketEntriesWithCaseClosingEventCodes[0].docketEntryId,
      docketNumber: '101-20',
    });

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
  });

  it('should remove the case from the trial session if the case has a trialSessionId', async () => {
    applicationContext
      .getPersistenceGateway()
      .getTrialSessionById.mockReturnValue({
        caseOrder: [
          {
            docketNumber: '101-20',
          },
        ],
        createdAt: '2019-10-27T05:00:00.000Z',
        gsi1pk: 'trial-session-catalog',
        isCalendared: false,
        judge: {
          name: 'Judge Colvin',
          userId: 'dabbad00-18d0-43ec-bafb-654e83405416',
        },
        maxCases: 100,
        pk: 'trial-session|959c4338-0fac-42eb-b0eb-d53b8d0195cc',
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
      });

    extendCase.trialSessionId = 'c54ba5a9-b37b-479d-9201-067ec6e335bb';

    await serveCourtIssuedDocumentInteractor({
      applicationContext,
      docketEntryId: docketEntriesWithCaseClosingEventCodes[0].docketEntryId,
      docketNumber: '101-20',
    });

    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateTrialSession,
    ).toHaveBeenCalled();
  });

  docketEntriesWithCaseClosingEventCodes.forEach(document => {
    it(`should set the case status to closed for event code: ${document.eventCode}`, async () => {
      await serveCourtIssuedDocumentInteractor({
        applicationContext,
        docketEntryId: document.docketEntryId,
        docketNumber: '101-20',
      });

      const updatedCase = applicationContext.getPersistenceGateway().updateCase
        .mock.calls[0][0].caseToUpdate;

      expect(updatedCase.status).toEqual(CASE_STATUS_TYPES.closed);
      expect(
        applicationContext.getPersistenceGateway()
          .deleteCaseTrialSortMappingRecords,
      ).toHaveBeenCalled();
    });
  });
});
