const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  fileExternalDocumentInteractor,
} = require('./fileExternalDocumentInteractor');
const { AUTOMATIC_BLOCKED_REASONS } = require('../../entities/EntityConstants');
const { CASE_STATUS_TYPES } = require('../../entities/EntityConstants');
const { MOCK_USERS } = require('../../../test/mockUsers');
const { User } = require('../../entities/User');

describe('fileExternalDocumentInteractor', () => {
  let caseRecord;

  beforeEach(() => {
    caseRecord = {
      caseCaption: 'Caption',
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      caseType: 'Deficiency',
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
      docketNumber: '45678-18',
      docketRecord: [
        {
          description: 'first record',
          docketNumber: '45678-18',
          documentId: '8675309b-18d0-43ec-bafb-654e83405411',
          eventCode: 'P',
          filingDate: '2018-03-01T00:01:00.000Z',
          index: 1,
        },
      ],
      documents: [
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
      .getCaseByCaseId.mockReturnValue(caseRecord);
  });

  it('should throw an error when not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      fileExternalDocumentInteractor({
        applicationContext,
        documentIds: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentType: 'Memorandum in Support',
          filedBy: 'Test Petitioner',
        },
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should add documents and workitems and auto-serve the documents on the parties with an electronic service indicator', async () => {
    const updatedCase = await fileExternalDocumentInteractor({
      applicationContext,
      documentIds: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
      documentMetadata: {
        caseId: caseRecord.caseId,
        docketNumber: '45678-18',
        documentTitle: 'Memorandum in Support',
        documentType: 'Memorandum in Support',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItemForNonPaper,
    ).toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).toHaveBeenCalled();
    expect(updatedCase.documents[3].servedAt).toBeDefined();
  });

  it('should set secondary document and secondary supporting documents to lodged', async () => {
    const updatedCase = await fileExternalDocumentInteractor({
      applicationContext,
      documentIds: [
        'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        'c54ba5a9-b37b-479d-9201-067ec6e335bc',
        'c54ba5a9-b37b-479d-9201-067ec6e335bd',
        'c54ba5a9-b37b-479d-9201-067ec6e335be',
      ],
      documentMetadata: {
        caseId: caseRecord.caseId,
        docketNumber: '45678-18',
        documentTitle: 'Motion for Leave to File',
        documentType: 'Motion for Leave to File',
        eventCode: 'M115',
        filedBy: 'Test Petitioner',
        scenario: 'Nonstandard H',
        secondaryDocument: {
          documentTitle: 'Motion for Judgment on the Pleadings',
          documentType: 'Motion for Judgment on the Pleadings',
          eventCode: 'M121',
          filedBy: 'Test Petitioner',
        },
        secondarySupportingDocuments: [
          {
            documentTitle: 'Motion for in Camera Review',
            documentType: 'Motion for in Camera Review',
            eventCode: 'M135',
            filedBy: 'Test Petitioner',
          },
        ],
        supportingDocuments: [
          {
            documentTitle: 'Civil Penalty Approval Form',
            documentType: 'Civil Penalty Approval Form',
            eventCode: 'CIVP',
            filedBy: 'Test Petitioner',
          },
        ],
      },
    });
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(updatedCase.documents).toMatchObject([
      {}, // first 3 docs were already on the case
      {},
      {},
      {
        eventCode: 'M115', // primary document
        lodged: undefined,
      },
      {
        eventCode: 'CIVP', // supporting document
        lodged: undefined,
      },
      {
        eventCode: 'M121', //secondary document
        lodged: true,
      },
      {
        eventCode: 'M135', // secondary supporting document
        lodged: true,
      },
    ]);
  });

  it('should add documents and workitems but NOT auto-serve Simultaneous documents on the parties', async () => {
    let error;

    let updatedCase;
    try {
      updatedCase = await fileExternalDocumentInteractor({
        applicationContext,
        documentIds: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
        documentMetadata: {
          caseId: caseRecord.caseId,
          docketNumber: '45678-18',
          documentTitle: 'Simultaneous Memoranda of Law',
          documentType: 'Simultaneous Memoranda of Law',
          eventCode: 'A',
          filedBy: 'Test Petitioner',
        },
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeUndefined();
    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().saveWorkItemForNonPaper,
    ).toBeCalled();
    expect(applicationContext.getPersistenceGateway().updateCase).toBeCalled();
    expect(
      applicationContext.getUseCaseHelpers().sendServedPartiesEmails,
    ).not.toHaveBeenCalled();
    expect(updatedCase.documents[3].status).toBeUndefined();
    expect(updatedCase.documents[3].servedAt).toBeUndefined();
  });

  it('should create a high-priority work item if the case status is calendared', async () => {
    caseRecord.status = CASE_STATUS_TYPES.calendared;
    caseRecord.trialDate = '2019-03-01T21:40:46.415Z';

    await fileExternalDocumentInteractor({
      applicationContext,
      documentIds: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
      documentMetadata: {
        caseId: caseRecord.caseId,
        docketNumber: '45678-18',
        documentTitle: 'Simultaneous Memoranda of Law',
        documentType: 'Simultaneous Memoranda of Law',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
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
      documentIds: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
      documentMetadata: {
        caseId: caseRecord.caseId,
        docketNumber: '45678-18',
        documentTitle: 'Simultaneous Memoranda of Law',
        documentType: 'Simultaneous Memoranda of Law',
        eventCode: 'A',
        filedBy: 'test Petitioner',
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
      documentIds: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
      documentMetadata: {
        caseId: caseRecord.caseId,
        category: 'Application',
        docketNumber: '45678-18',
        documentTitle: 'Application for Waiver of Filing Fee',
        documentType: 'Application for Waiver of Filing Fee',
        eventCode: 'APPW',
        filedBy: 'Test Petitioner',
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
      .getCaseDeadlinesByCaseId.mockReturnValue([
        {
          deadlineDate: 'something',
        },
      ]);

    await fileExternalDocumentInteractor({
      applicationContext,
      documentIds: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
      documentMetadata: {
        caseId: caseRecord.caseId,
        category: 'Application',
        docketNumber: '45678-18',
        documentTitle: 'Application for Waiver of Filing Fee',
        documentType: 'Application for Waiver of Filing Fee',
        eventCode: 'APPW',
        filedBy: 'Test Petitioner',
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
