const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
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
    caseType: CASE_TYPES_MAP.deficiency,
    createdAt: '',
    docketEntries: [
      {
        docketEntryId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        docketNumber: '45678-18',
        documentContentsId: '442f46fd-727b-485c-8998-a0138593cebe',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        isDraft: true,
        userId: mockUserId,
      },
      {
        docketEntryId: 'a75e4cc8-deed-42d0-b7b0-3846004fe3f9',
        docketNumber: '45678-18',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        userId: mockUserId,
      },
      {
        docketEntryId: 'd3cc11ab-bbee-4d09-bc66-da267f3cfd07',
        docketNumber: '45678-18',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        userId: mockUserId,
      },
    ],
    docketNumber: '45678-18',
    filingType: 'Myself',
    partyType: PARTY_TYPES.petitioner,
    petitioners: [
      {
        address1: '123 Main St',
        city: 'Somewhere',
        contactType: CONTACT_TYPES.primary,
        countryType: COUNTRY_TYPES.DOMESTIC,
        email: 'fieri@example.com',
        name: 'Guy Fieri',
        phone: '1234567890',
        postalCode: '12345',
        state: 'CA',
      },
    ],
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
      .getCaseByDocketNumber.mockResolvedValue(caseRecord);
  });

  it('should throw an error if not authorized', async () => {
    mockCurrentUser.role = ROLES.privatePractitioner;
    mockUserById = { name: 'bob' };

    await expect(
      updateCourtIssuedOrderInteractor(applicationContext, {
        docketEntryIdToEdit: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentType: 'Order to Show Cause',
          eventCode: 'OSC',
        },
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if document is not found', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue();

    await expect(
      updateCourtIssuedOrderInteractor(applicationContext, {
        docketEntryIdToEdit: '986fece3-6325-4418-bb28-a7095e6707b4',
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentType: 'Order to Show Cause',
          eventCode: 'OSC',
        },
      }),
    ).rejects.toThrow('Document not found');
  });

  it('update existing document within case', async () => {
    await updateCourtIssuedOrderInteractor(applicationContext, {
      docketEntryIdToEdit: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentTitle: 'Order to Show Cause Title',
        documentType: 'Notice',
        draftOrderState: {
          documentType: 'Order to Show Cause',
          eventCode: 'OSC',
        },
        eventCode: 'NOT',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries.length,
    ).toEqual(3);
    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        caseToUpdate: expect.objectContaining({
          docketEntries: expect.arrayContaining([
            expect.objectContaining({
              documentType: 'Order to Show Cause',
              eventCode: 'OSC',
              freeText: 'Order to Show Cause Title',
            }),
          ]),
        }),
      }),
    );
  });

  it('stores documentContents in S3 if present', async () => {
    await updateCourtIssuedOrderInteractor(applicationContext, {
      docketEntryIdToEdit: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentContents: 'the contents!',
        documentType: 'Order to Show Cause',
        draftOrderState: {
          documentContents: 'the contents!',
          richText: '<b>the contents!</b>',
        },
        eventCode: 'OSC',
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
        .caseToUpdate.docketEntries[2].documentContents,
    ).toBeUndefined();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries[2].draftOrderState,
    ).toBeUndefined();
  });

  it('does not update non-editable fields on document', async () => {
    await updateCourtIssuedOrderInteractor(applicationContext, {
      docketEntryIdToEdit: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documentMetadata: {
        docketNumber: caseRecord.docketNumber,
        documentType: 'Order to Show Cause',
        draftOrderState: {},
        eventCode: 'OSC',
        judge: 'Judge Judgy',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toBeCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries.length,
    ).toEqual(3);
  });
});
