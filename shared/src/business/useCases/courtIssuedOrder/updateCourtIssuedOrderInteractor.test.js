const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  updateCourtIssuedOrderInteractor,
} = require('./updateCourtIssuedOrderInteractor');
const { User } = require('../../entities/User');

describe('updateCourtIssuedOrderInteractor', () => {
  let mockCurrentUser;
  let mockUserById;
  const mockUserId = applicationContext.getUniqueId();

  let caseRecord = {
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
        filedBy: 'Test Petitioner',
        userId: mockUserId,
      },
      {
        docketNumber: '45678-18',
        documentId: 'a75e4cc8-deed-42d0-b7b0-3846004fe3f9',
        documentType: 'Answer',
        filedBy: 'Test Petitioner',
        userId: mockUserId,
      },
      {
        docketNumber: '45678-18',
        documentId: 'd3cc11ab-bbee-4d09-bc66-da267f3cfd07',
        documentType: 'Answer',
        filedBy: 'Test Petitioner',
        userId: mockUserId,
      },
    ],
    filingType: 'Myself',
    partyType: PARTY_TYPES.petitioner,
    preferredTrialCity: 'Fresno, California',
    procedureType: 'Regular',
    role: ROLES.petitioner,
    userId: '3433e36f-3b50-4c92-aa55-6efb4e432883',
  };

  beforeEach(() => {
    mockCurrentUser = new User({
      name: 'Olivia Jade',
      role: ROLES.petitionsClerk,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    applicationContext.getCurrentUser.mockImplementation(() => mockCurrentUser);

    mockUserById = {
      name: 'bob',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };

    applicationContext
      .getPersistenceGateway()
      .getUserById.mockImplementation(() => mockUserById);

    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockResolvedValue(caseRecord);
  });

  it('should throw an error if not authorized', async () => {
    mockCurrentUser.role = ROLES.privatePractitioner;
    mockUserById = { name: 'bob' };

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

  it('should throw an error if document is not found', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue();

    await expect(
      updateCourtIssuedOrderInteractor({
        applicationContext,
        documentIdToEdit: '986fece3-6325-4418-bb28-a7095e6707b4',
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentType: 'Order to Show Cause',
        },
      }),
    ).rejects.toThrow('Document not found');
  });

  it('update existing document within case', async () => {
    await updateCourtIssuedOrderInteractor({
      applicationContext,
      documentIdToEdit: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentMetadata: {
        caseId: caseRecord.caseId,
        documentType: 'Order to Show Cause',
        draftState: {},
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
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0],
    ).toMatchObject({ useTempBucket: false });
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
    await updateCourtIssuedOrderInteractor({
      applicationContext,
      documentIdToEdit: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentMetadata: {
        caseId: caseRecord.caseId,
        documentType: 'Order to Show Cause',
        draftState: {},
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
