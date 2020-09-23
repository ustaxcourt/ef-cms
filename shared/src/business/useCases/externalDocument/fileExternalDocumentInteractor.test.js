const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  AUTOMATIC_BLOCKED_REASONS,
  CASE_STATUS_TYPES,
  CASE_TYPES_MAP,
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  fileExternalDocumentInteractor,
} = require('./fileExternalDocumentInteractor');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { User } = require('../../entities/User');

describe('fileExternalDocumentInteractor', () => {
  const mockDocumentId = applicationContext.getUniqueId();

  let caseRecord;

  beforeEach(() => {
    caseRecord = {
      caseCaption: 'Caption',
      caseType: CASE_TYPES_MAP.deficiency,
      contactPrimary: {
        address1: '123 Main St',
        city: 'Somewhere',
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'fieri@example.com',
        name: 'Guy Fieri',
        phone: '1234567890',
        postalCode: '12345',
        state: 'CA',
      },
      createdAt: '',
      docketEntries: [
        {
          description: 'first record',
          docketNumber: '45678-18',
          documentId: '8675309b-18d0-43ec-bafb-654e83405411',
          documentType: 'Petition',
          eventCode: 'P',
          filedBy: 'Test Petitioner',
          filingDate: '2018-03-01T00:01:00.000Z',
          index: 1,
          isOnDocketRecord: true,
          userId: '15fac684-d333-45c2-b414-4af63a7f7613',
        },
        {
          docketNumber: '45678-18',
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          userId: '15fac684-d333-45c2-b414-4af63a7f7613',
        },
        {
          docketNumber: '45678-18',
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          userId: '15fac684-d333-45c2-b414-4af63a7f7613',
        },
        {
          docketNumber: '45678-18',
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Answer',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
          userId: '15fac684-d333-45c2-b414-4af63a7f7613',
        },
      ],
      docketNumber: '45678-18',
      filingType: 'Myself',
      partyType: PARTY_TYPES.petitioner,
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
      role: ROLES.petitioner,
      userId: '0e97c6b4-d299-44f5-af99-2ce905d520f2',
    };

    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'irsPractitioner',
        role: ROLES.irsPractitioner,
        userId: 'f7d90c05-f6cd-442c-a168-202db587f16f',
      }),
    );

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(({ userId }) => MOCK_USERS[userId]);

    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(caseRecord);
  });

  it('should throw an error when not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      fileExternalDocumentInteractor({
        applicationContext,
        documentMetadata: {},
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should add documents and workitems and auto-serve the documents on the parties with an electronic service indicator', async () => {
    const updatedCase = await fileExternalDocumentInteractor({
      applicationContext,
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Memorandum in Support',
        documentType: 'Memorandum in Support',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        primaryDocumentId: mockDocumentId,
      },
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItemForNonPaper,
    ).toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();
    expect(updatedCase.docketEntries[4].servedAt).toBeDefined();
  });

  it('should set secondary document and secondary supporting documents to lodged', async () => {
    const updatedCase = await fileExternalDocumentInteractor({
      applicationContext,
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Motion for Leave to File',
        documentType: 'Motion for Leave to File',
        eventCode: 'M115',
        filedBy: 'Test Petitioner',
        primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        scenario: 'Nonstandard H',
        secondaryDocument: {
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          documentTitle: 'Motion for Judgment on the Pleadings',
          documentType: 'Motion for Judgment on the Pleadings',
          eventCode: 'M121',
          filedBy: 'Test Petitioner',
        },
        secondarySupportingDocuments: [
          {
            documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bd',
            documentTitle: 'Motion for in Camera Review',
            documentType: 'Motion for in Camera Review',
            eventCode: 'M135',
            filedBy: 'Test Petitioner',
          },
        ],
        supportingDocuments: [
          {
            documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335be',
            documentTitle: 'Civil Penalty Approval Form',
            documentType: 'Civil Penalty Approval Form',
            eventCode: 'CIVP',
            filedBy: 'Test Petitioner',
          },
        ],
      },
    });
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(updatedCase.docketEntries).toMatchObject([
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
    const updatedCase = await fileExternalDocumentInteractor({
      applicationContext,
      documentIds: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Simultaneous Memoranda of Law',
        documentType: 'Simultaneous Memoranda of Law',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItemForNonPaper,
    ).toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).not.toHaveBeenCalled();
    expect(updatedCase.docketEntries[3].status).toBeUndefined();
    expect(updatedCase.docketEntries[3].servedAt).toBeUndefined();
  });

  it('should create a high-priority work item if the case status is calendared', async () => {
    caseRecord.status = CASE_STATUS_TYPES.calendared;
    caseRecord.trialDate = '2019-03-01T21:40:46.415Z';
    caseRecord.trialSessionId = 'c54ba5a9-b37b-479d-9201-067ec6e335bc';

    await fileExternalDocumentInteractor({
      applicationContext,
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Simultaneous Memoranda of Law',
        documentType: 'Simultaneous Memoranda of Law',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItemForNonPaper,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItemForNonPaper.mock
        .calls[0][0],
    ).toMatchObject({
      workItem: { highPriority: true, trialDate: '2019-03-01T21:40:46.415Z' },
    });
  });

  it('should create a not-high-priority work item if the case status is not calendared', async () => {
    caseRecord.status = CASE_STATUS_TYPES.new;

    await fileExternalDocumentInteractor({
      applicationContext,
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Simultaneous Memoranda of Law',
        documentType: 'Simultaneous Memoranda of Law',
        eventCode: 'A',
        filedBy: 'test Petitioner',
        primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().saveWorkItemForNonPaper,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItemForNonPaper.mock
        .calls[0][0],
    ).toMatchObject({
      workItem: { highPriority: false },
    });
  });

  it('should automatically block the case if the document filed is a tracked document', async () => {
    await fileExternalDocumentInteractor({
      applicationContext,
      documentMetadata: {
        category: 'Application',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Application for Waiver of Filing Fee',
        documentType: 'Application for Waiver of Filing Fee',
        eventCode: 'APPW',
        filedBy: 'Test Petitioner',
        primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
    });

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

  it('should automatically block the case with deadlines if the document filed is a tracked document and the case has a deadline', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByDocketNumber.mockReturnValue([
        {
          deadlineDate: 'something',
        },
      ]);

    await fileExternalDocumentInteractor({
      applicationContext,
      documentIds: [],
      documentMetadata: {
        category: 'Application',
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Application for Waiver of Filing Fee',
        documentType: 'Application for Waiver of Filing Fee',
        eventCode: 'APPW',
        filedBy: 'Test Petitioner',
        primaryDocumentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate,
    });
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toBeCalled();
  });
});
