const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  fileCourtIssuedDocketEntryInteractor,
} = require('./fileCourtIssuedDocketEntryInteractor');
const { Case } = require('../../entities/cases/Case');
const { ContactFactory } = require('../../entities/contacts/ContactFactory');
const { User } = require('../../entities/User');

describe('fileCourtIssuedDocketEntryInteractor', () => {
  let caseRecord;

  beforeEach(() => {
    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      name: 'Olivia Jade',
      role: User.ROLES.docketClerk,
      section: 'docket',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(caseRecord);

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
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          userId: 'irsPractitioner',
        },
        {
          docketNumber: '45678-18',
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          userId: 'irsPractitioner',
        },
        {
          docketNumber: '45678-18',
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentTitle: 'Answer',
          documentType: 'Answer',
          eventCode: 'A',
          userId: 'irsPractitioner',
        },
        {
          docketNumber: '45678-18',
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
          documentTitle: 'Order',
          documentType: 'Order',
          eventCode: 'O',
          userId: 'irsPractitioner',
        },
        {
          docketNumber: '45678-18',
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          documentTitle: 'Order to Show Cause',
          documentType: 'Order to Show Cause',
          eventCode: 'OSC',
          userId: 'irsPractitioner',
        },
        {
          docketNumber: '45678-18',
          documentId: '7f61161c-ede8-43ba-8fab-69e15d057012',
          documentTitle: 'Transcript of [anything] on [date]',
          documentType: 'TRAN - Transcript',
          eventCode: 'TRAN',
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
  });

  it('should throw an error if not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      fileCourtIssuedDocketEntryInteractor({
        applicationContext,
        documentMeta: {
          caseId: caseRecord.caseId,
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          documentType: 'Memorandum in Support',
        },
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if the document is not found on the case', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Olivia Jade',
      role: User.ROLES.docketClerk,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await expect(
      fileCourtIssuedDocketEntryInteractor({
        applicationContext,
        documentMeta: {
          caseId: caseRecord.caseId,
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bd',
          documentType: 'Order',
        },
      }),
    ).rejects.toThrow('Document not found');
  });

  it('should call updateCase, createUserInboxRecord, and createSectionInboxRecord', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Olivia Jade',
      role: User.ROLES.docketClerk,
      section: 'docket',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await fileCourtIssuedDocketEntryInteractor({
      applicationContext,
      documentMeta: {
        caseId: caseRecord.caseId,
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
        documentTitle: 'Order',
        documentType: 'Order',
        eventCode: 'O',
        generatedDocumentTitle: 'Generated Order Document Title',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().createUserInboxRecord,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().createSectionInboxRecord,
    ).toHaveBeenCalled();
  });

  it('should call updateCase and set the case as automatic blocked if the document is a tracked document', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Olivia Jade',
      role: User.ROLES.docketClerk,
      section: 'docket',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await fileCourtIssuedDocketEntryInteractor({
      applicationContext,
      documentMeta: {
        caseId: caseRecord.caseId,
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
        documentTitle: 'Order to Show Cause',
        documentType: 'Order to Show Cause',
        eventCode: 'OSC',
        generatedDocumentTitle: 'Generated Order Document Title',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
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

  it('should call updateCase and set the case as automatic blocked with deadlines if the document is a tracked document and the case has deadlines', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseDeadlinesByCaseId.mockReturnValue([
        {
          deadlineDate: 'sometime',
        },
      ]);
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Olivia Jade',
      role: User.ROLES.docketClerk,
      section: 'docket',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await fileCourtIssuedDocketEntryInteractor({
      applicationContext,
      documentMeta: {
        caseId: caseRecord.caseId,
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
        documentTitle: 'Order to Show Cause',
        documentType: 'Order to Show Cause',
        eventCode: 'OSC',
        generatedDocumentTitle: 'Generated Order Document Title',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
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

  it('should set secondaryDate on the created document if the eventCode is TRAN', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Olivia Jade',
      role: User.ROLES.docketClerk,
      section: 'docket',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await fileCourtIssuedDocketEntryInteractor({
      applicationContext,
      documentMeta: {
        caseId: caseRecord.caseId,
        date: '2019-03-01T21:40:46.415Z',
        documentId: '7f61161c-ede8-43ba-8fab-69e15d057012',
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'TRAN - Transcript',
        eventCode: 'TRAN',
        freeText: 'Dogs',
        generatedDocumentTitle: 'Transcript of Dogs on 03-01-19',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.documents[5],
    ).toMatchObject({
      secondaryDate: '2019-03-01T21:40:46.415Z',
    });
  });
});
