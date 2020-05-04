const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  updateCourtIssuedOrderInteractor,
} = require('./updateCourtIssuedOrderInteractor');
const { User } = require('../../entities/User');

describe('updateCourtIssuedOrderInteractor', () => {
  let mockUser;

  let caseRecord = {
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
        documentContentsId: '442f46fd-727b-485c-8998-a0138593cebe',
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'irsPractitioner',
      },
      {
        docketNumber: '45678-18',
        documentId: 'a75e4cc8-deed-42d0-b7b0-3846004fe3f9',
        documentType: 'Answer',
        userId: 'irsPractitioner',
      },
      {
        docketNumber: '45678-18',
        documentId: 'd3cc11ab-bbee-4d09-bc66-da267f3cfd07',
        documentType: 'Answer',
        userId: 'irsPractitioner',
      },
    ],
    filingType: 'Myself',
    partyType: 'Petitioner',
    preferredTrialCity: 'Fresno, California',
    procedureType: 'Regular',
    role: User.ROLES.petitioner,
    userId: 'petitioner',
  };

  beforeEach(() => {
    applicationContext.environment.stage = 'local';
    applicationContext.getCurrentUser.mockImplementation(() => mockUser);
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockResolvedValue(caseRecord);
  });

  it('should throw an error if not authorized', async () => {
    mockUser = new User({
      name: 'Olivia Jade',
      role: User.ROLES.privatePractitioner,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    applicationContext
      .getPersistenceGateway()
      .updateCase.mockResolvedValue(caseRecord);
    applicationContext
      .getPersistenceGateway()
      .getUserById.mockResolvedValue({ name: 'bob' });

    await expect(
      updateCourtIssuedOrderInteractor({
        applicationContext,
        documentIdToEdit: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentType: 'Order to Show Cause',
        },
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('update existing document within case', async () => {
    mockUser = new User({
      name: 'Olivia Jade',
      role: User.ROLES.petitionsClerk,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      name: 'bob',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await updateCourtIssuedOrderInteractor({
      applicationContext,
      documentIdToEdit: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentMetadata: {
        caseId: caseRecord.caseId,
        documentType: 'Order to Show Cause',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.documents.length,
    ).toEqual(3);
  });

  it('stores documentContents in S3 if present', async () => {
    mockUser = new User({
      name: 'Olivia Jade',
      role: User.ROLES.petitionsClerk,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      name: 'bob',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await updateCourtIssuedOrderInteractor({
      applicationContext,
      documentIdToEdit: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentMetadata: {
        caseId: caseRecord.caseId,
        documentContents: 'the contents!',
        documentType: 'Order to Show Cause',
        draftState: {
          documentContents: 'the contents!',
          richText: '<b>the contents!</b>',
        },
        richText: '<b>the contents!</b>',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.documents[2].documentContents,
    ).toBeUndefined();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.documents[2].draftState,
    ).toBeUndefined();
  });

  it('does not update non-editable fields on document', async () => {
    mockUser = new User({
      name: 'Olivia Jade',
      role: User.ROLES.petitionsClerk,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue({
      name: 'bob',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await updateCourtIssuedOrderInteractor({
      applicationContext,
      documentIdToEdit: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentMetadata: {
        caseId: caseRecord.caseId,
        documentType: 'Order to Show Cause',
        judge: 'Judge Judgy',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.documents.length,
    ).toEqual(3);
  });
});
