const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  fileExternalDocumentInteractor,
} = require('./fileExternalDocumentInteractor');
const { Case } = require('../../entities/cases/Case');
const { ContactFactory } = require('../../entities/contacts/ContactFactory');
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
        countryType: 'domestic',
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
          userId: 'irsPractitioner',
        },
        {
          docketNumber: '45678-18',
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Answer',
          eventCode: 'A',
          userId: 'irsPractitioner',
        },
        {
          docketNumber: '45678-18',
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Answer',
          eventCode: 'A',
          userId: 'irsPractitioner',
        },
      ],
      filingType: 'Myself',
      partyType: ContactFactory.PARTY_TYPES.petitioner,
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
      role: User.ROLES.petitioner,
      userId: 'petitioner',
    };

    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'irsPractitioner',
        role: User.ROLES.irsPractitioner,
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
    expect(updatedCase.documents[3].status).toEqual('served');
    expect(updatedCase.documents[3].servedAt).toBeDefined();
  });

  it('should set secondary document and secondary supporting documents to lodged with eventCode MISL', async () => {
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
        secondaryDocument: {
          documentTitle: 'Motion for Judgment on the Pleadings',
          documentType: 'Motion for Judgment on the Pleadings',
          eventCode: 'M121',
        },
        secondarySupportingDocuments: [
          {
            documentTitle: 'Motion for in Camera Review',
            documentType: 'Motion for in Camera Review',
            eventCode: 'M135',
          },
        ],
        supportingDocuments: [
          {
            documentTitle: 'Civil Penalty Approval Form',
            documentType: 'Civil Penalty Approval Form',
            eventCode: 'CIVP',
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
        eventCode: 'MISL', //secondary document
        lodged: true,
      },
      {
        eventCode: 'MISL', // secondary supporting document
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
    caseRecord.status = Case.STATUS_TYPES.calendared;
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
    caseRecord.status = Case.STATUS_TYPES.new;

    await fileExternalDocumentInteractor({
      applicationContext,
      documentIds: ['c54ba5a9-b37b-479d-9201-067ec6e335bb'],
      documentMetadata: {
        caseId: caseRecord.caseId,
        docketNumber: '45678-18',
        documentTitle: 'Simultaneous Memoranda of Law',
        documentType: 'Simultaneous Memoranda of Law',
        eventCode: 'A',
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
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: Case.AUTOMATIC_BLOCKED_REASONS.pending,
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
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate,
    ).toMatchObject({
      automaticBlocked: true,
      automaticBlockedDate: expect.anything(),
      automaticBlockedReason: Case.AUTOMATIC_BLOCKED_REASONS.pendingAndDueDate,
    });
    expect(
      applicationContext.getPersistenceGateway()
        .deleteCaseTrialSortMappingRecords,
    ).toBeCalled();
  });
});
