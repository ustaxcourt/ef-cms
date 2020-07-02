import { updateCourtIssuedDocketEntryInteractor } from './updateCourtIssuedDocketEntryInteractor';
const {
  applicationContext,
} = require('../../test/createTestApplicationContext');
const {
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} = require('../../entities/EntityConstants');
const { CASE_STATUS_TYPES } = require('../../entities/EntityConstants');

describe('updateCourtIssuedDocketEntryInteractor', () => {
  let caseRecord;
  const mockUserId = applicationContext.getUniqueId();

  beforeAll(() => {
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
          docketRecordId: '8675309b-18d0-43ec-bafb-654e83405411',
          documentId: '8675309b-18d0-43ec-bafb-654e83405411',
          eventCode: 'P',
          filingDate: '2018-03-01T00:01:00.000Z',
          index: 1,
        },
      ],
      documents: [
        {
          docketNumber: '45678-18',
          documentId: '30413c1e-9a71-4c22-8c11-41f8689313ae',
          documentType: 'Answer',
          filedBy: 'Test Petitioner',
          userId: mockUserId,
        },
        {
          docketNumber: '45678-18',
          documentId: 'e27d2d4e-f768-4167-b2c9-989dccbbb738',
          documentType: 'Answer',
          filedBy: 'Test Petitioner',
          userId: mockUserId,
        },
        {
          docketNumber: '45678-18',
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
          documentType: 'Answer',
          filedBy: 'Test Petitioner',
          userId: mockUserId,
        },
        {
          docketNumber: '45678-18',
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
          documentType: 'Order',
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
          userId: mockUserId,
          workItems: [
            {
              assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
              assigneeName: 'bob',
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
              caseStatus: CASE_STATUS_TYPES.new,
              caseTitle: 'Johnny Joe Jacobson',
              docketNumber: '101-18',
              docketNumberSuffix: 'S',
              document: {},
              isQC: true,
              messages: [],
              section: 'docket',
              sentBy: 'bob',
            },
          ],
        },
        {
          docketNumber: '45678-18',
          documentId: '7f61161c-ede8-43ba-8fab-69e15d057012',
          documentTitle: 'Transcript of [anything] on [date]',
          documentType: 'Transcript',
          eventCode: 'TRAN',
          userId: mockUserId,
          workItems: [
            {
              assigneeId: '8b4cd447-6278-461b-b62b-d9e357eea62c',
              assigneeName: 'bob',
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
              caseStatus: CASE_STATUS_TYPES.new,
              docketNumber: '101-18',
              docketNumberSuffix: 'S',
              document: {},
              isQC: true,
              messages: [],
              section: 'docket',
              sentBy: 'bob',
            },
          ],
        },
      ],
      filingType: 'Myself',
      partyType: PARTY_TYPES.petitioner,
      preferredTrialCity: 'Fresno, California',
      procedureType: 'Regular',
      role: ROLES.petitioner,
      userId: '8100e22a-c7f2-4574-b4f6-eb092fca9f35',
    };

    applicationContext.getPersistenceGateway().getUserById.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(caseRecord);
  });

  it('should throw an error if not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      updateCourtIssuedDocketEntryInteractor({
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
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.docketClerk,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await expect(
      updateCourtIssuedDocketEntryInteractor({
        applicationContext,
        documentMeta: {
          caseId: caseRecord.caseId,
          documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bc',
          documentType: 'Order',
          signedAt: '2019-03-01T21:40:46.415Z',
          signedByUserId: mockUserId,
          signedJudgeName: 'Dredd',
        },
      }),
    ).rejects.toThrow('Document not found');
  });

  it('should call updateCase, createUserInboxRecord, and createSectionInboxRecord', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.docketClerk,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await updateCourtIssuedDocketEntryInteractor({
      applicationContext,
      documentMeta: {
        caseId: caseRecord.caseId,
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
        documentType: 'Order',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
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

  it('should set secondaryDate on the created document if the eventCode is TRAN', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.docketClerk,
      section: 'docket',
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await updateCourtIssuedDocketEntryInteractor({
      applicationContext,
      documentMeta: {
        caseId: caseRecord.caseId,
        date: '2019-03-01T21:40:46.415Z',
        documentId: '7f61161c-ede8-43ba-8fab-69e15d057012',
        documentTitle: 'Transcript of [anything] on [date]',
        documentType: 'Transcript',
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
        .caseToUpdate.documents[4],
    ).toMatchObject({
      secondaryDate: '2019-03-01T21:40:46.415Z',
    });
  });

  it('should not update non-editable fields on the document', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
      role: ROLES.docketClerk,
      userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    await updateCourtIssuedDocketEntryInteractor({
      applicationContext,
      documentMeta: {
        caseId: caseRecord.caseId,
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
        documentType: 'Order',
        objections: 'No',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.documents[3].objections,
    ).toBeUndefined();
  });
});
