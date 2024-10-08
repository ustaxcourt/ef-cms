import '@web-api/persistence/postgres/cases/mocks.jest';
import '@web-api/persistence/postgres/workitems/mocks.jest';
import {
  CASE_TYPES_MAP,
  CONTACT_TYPES,
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} from '../../../../../shared/src/business/entities/EntityConstants';
import { Case } from '@shared/business/entities/cases/Case';
import { MOCK_LOCK } from '../../../../../shared/src/test/mockLock';
import { ServiceUnavailableError } from '@web-api/errors/errors';
import { applicationContext } from '../../../../../shared/src/business/test/createTestApplicationContext';
import {
  mockPetitionerUser,
  mockPetitionsClerkUser,
  mockPrivatePractitionerUser,
} from '@shared/test/mockAuthUsers';
import { updateCourtIssuedOrderInteractor } from './updateCourtIssuedOrderInteractor';

describe('updateCourtIssuedOrderInteractor', () => {
  const mockUserId = applicationContext.getUniqueId();
  let mockUserById;

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
        filedByRole: ROLES.petitioner,
        isDraft: true,
        userId: mockUserId,
      },
      {
        docketEntryId: 'a75e4cc8-deed-42d0-b7b0-3846004fe3f9',
        docketNumber: '45678-18',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        filedByRole: ROLES.petitioner,
        userId: mockUserId,
      },
      {
        docketEntryId: 'd3cc11ab-bbee-4d09-bc66-da267f3cfd07',
        docketNumber: '45678-18',
        documentType: 'Answer',
        eventCode: 'A',
        filedBy: 'Test Petitioner',
        filedByRole: ROLES.petitioner,
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
        name: 'Roslindis Angelino',
        phone: '1234567890',
        postalCode: '12345',
        state: 'CA',
      },
    ],
    preferredTrialCity: 'Fresno, California',
    procedureType: 'Small',
    role: ROLES.petitioner,
    userId: '3433e36f-3b50-4c92-aa55-6efb4e432883',
  };
  let mockLock;

  beforeAll(() => {
    applicationContext
      .getPersistenceGateway()
      .getLock.mockImplementation(() => mockLock);
  });

  beforeEach(() => {
    mockLock = undefined;
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
    // mockCurrentUser.role = ROLES.privatePractitioner;
    mockUserById = { name: 'bob' };

    await expect(
      updateCourtIssuedOrderInteractor(
        applicationContext,
        {
          docketEntryIdToEdit: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentMetadata: {
            docketNumber: caseRecord.docketNumber,
            documentType: 'Order to Show Cause',
            eventCode: 'OSC',
          },
        },
        mockPrivatePractitionerUser,
      ),
    ).rejects.toThrow('Unauthorized');
  });

  it('should throw an error if document is not found', async () => {
    applicationContext.getPersistenceGateway().getUserById.mockResolvedValue();

    await expect(
      updateCourtIssuedOrderInteractor(
        applicationContext,
        {
          docketEntryIdToEdit: '986fece3-6325-4418-bb28-a7095e6707b4',
          documentMetadata: {
            docketNumber: caseRecord.docketNumber,
            documentType: 'Order to Show Cause',
            eventCode: 'OSC',
          },
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow('Document not found');
  });

  it('update existing document within case', async () => {
    await updateCourtIssuedOrderInteractor(
      applicationContext,
      {
        docketEntryIdToEdit: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Order of Dismissal for Lack of Jurisdiction',
          documentType: 'Notice',
          draftOrderState: {
            documentType: 'Order of Dismissal for Lack of Jurisdiction',
            eventCode: 'ODJ',
          },
          eventCode: 'NOT',
        },
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
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
              documentType: 'Order of Dismissal for Lack of Jurisdiction',
              eventCode: 'ODJ',
              freeText: 'Order of Dismissal for Lack of Jurisdiction',
            }),
          ]),
        }),
      }),
    );
  });

  it('should not populate free text for OSCP', async () => {
    const mockDocumentTitle = 'Order to Show Cause Title';

    await updateCourtIssuedOrderInteractor(
      applicationContext,
      {
        docketEntryIdToEdit: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: mockDocumentTitle,
          documentType: 'Notice',
          draftOrderState: {
            documentType: 'Order to Show Cause',
            eventCode: 'OSCP',
          },
          eventCode: 'NOT',
        },
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
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
            expect.not.objectContaining({
              freeText: mockDocumentTitle,
            }),
          ]),
        }),
      }),
    );
  });

  it('should not populate free text for OF', async () => {
    const mockDocumentTitle = 'Order for Filing Fee Title';

    await updateCourtIssuedOrderInteractor(
      applicationContext,
      {
        docketEntryIdToEdit: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: mockDocumentTitle,
          documentType: 'Notice',
          draftOrderState: {
            documentType: 'Order for Filing Fee',
            eventCode: 'OF',
          },
          eventCode: 'NOT',
        },
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
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
            expect.not.objectContaining({
              freeText: mockDocumentTitle,
            }),
          ]),
        }),
      }),
    );
  });

  it('should not populate free text for OAP', async () => {
    const mockDocumentTitle = 'Order for Amended Petition Title';
    await updateCourtIssuedOrderInteractor(
      applicationContext,
      {
        docketEntryIdToEdit: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: mockDocumentTitle,
          documentType: 'Notice',
          draftOrderState: {
            documentType: 'Order for Amended Petition',
            eventCode: 'OAP',
          },
          eventCode: 'NOT',
        },
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
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
            expect.not.objectContaining({
              freeText: mockDocumentTitle,
            }),
          ]),
        }),
      }),
    );
  });

  it('should not update freeText on existing document within case if not an order type', async () => {
    await updateCourtIssuedOrderInteractor(
      applicationContext,
      {
        docketEntryIdToEdit: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Notice Title',
          documentType: 'Notice',
          eventCode: 'A',
        },
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
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
              documentType: 'Notice',
              eventCode: 'A',
              freeText: undefined,
            }),
          ]),
        }),
      }),
    );
  });

  it('stores documentContents in S3 if present', async () => {
    await updateCourtIssuedOrderInteractor(
      applicationContext,
      {
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
      },
      mockPetitionsClerkUser,
    );

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

  it('should still contain the case caption in documentContents when edited', async () => {
    let mockContents = 'the contents!';

    await updateCourtIssuedOrderInteractor(
      applicationContext,
      {
        docketEntryIdToEdit: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentContents: mockContents,
          documentType: 'Order to Show Cause',
          draftOrderState: {
            documentContents: mockContents,
            richText: '<b>the contents!</b>',
          },
          eventCode: 'OSC',
          richText: '<b>the contents!</b>',
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
        },
      },
      mockPetitionsClerkUser,
    );

    const newCaseEntity = new Case(caseRecord, {
      authorizedUser: mockPetitionerUser,
    });

    const expectedDocumentContents =
      mockContents +
      ` ${newCaseEntity.docketNumberWithSuffix} ${newCaseEntity.caseCaption}`;

    const expectedContentsToStore = {
      documentContents: expectedDocumentContents,
      richText: `<b>${mockContents}</b>`,
    };

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0],
    ).toMatchObject({
      document: Buffer.from(JSON.stringify(expectedContentsToStore)),
    });
  });

  it('does not update non-editable fields on document', async () => {
    await updateCourtIssuedOrderInteractor(
      applicationContext,
      {
        docketEntryIdToEdit: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentType: 'Order to Show Cause',
          draftOrderState: undefined,
          eventCode: 'OSC',
          judge: 'Judge Judgy',
        },
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.docketEntries.length,
    ).toEqual(3);
  });

  it('should throw a ServiceUnavailableError if the Case is currently locked', async () => {
    mockLock = MOCK_LOCK;

    await expect(
      updateCourtIssuedOrderInteractor(
        applicationContext,
        {
          docketEntryIdToEdit: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentMetadata: {
            docketNumber: caseRecord.docketNumber,
            documentTitle: 'Order of Dismissal for Lack of Jurisdiction',
            documentType: 'Notice',
            draftOrderState: {
              documentType: 'Order of Dismissal for Lack of Jurisdiction',
              eventCode: 'ODJ',
            },
            eventCode: 'NOT',
          },
        },
        mockPetitionsClerkUser,
      ),
    ).rejects.toThrow(ServiceUnavailableError);

    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber,
    ).not.toHaveBeenCalled();
  });

  it('should acquire and remove the lock on the case', async () => {
    await updateCourtIssuedOrderInteractor(
      applicationContext,
      {
        docketEntryIdToEdit: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentMetadata: {
          docketNumber: caseRecord.docketNumber,
          documentTitle: 'Order of Dismissal for Lack of Jurisdiction',
          documentType: 'Notice',
          draftOrderState: {
            documentType: 'Order of Dismissal for Lack of Jurisdiction',
            eventCode: 'ODJ',
          },
          eventCode: 'NOT',
        },
      },
      mockPetitionsClerkUser,
    );

    expect(
      applicationContext.getPersistenceGateway().createLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifier: `case|${caseRecord.docketNumber}`,
      ttl: 30,
    });

    expect(
      applicationContext.getPersistenceGateway().removeLock,
    ).toHaveBeenCalledWith({
      applicationContext,
      identifiers: [`case|${caseRecord.docketNumber}`],
    });
  });
});
