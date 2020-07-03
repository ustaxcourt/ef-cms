const {
  applicationContext,
  getFakeFile,
} = require('../../test/createTestApplicationContext');
const {
  COUNTRY_TYPES,
  PARTY_TYPES,
  ROLES,
} = require('../../entities/EntityConstants');
const {
  fileCourtIssuedOrderInteractor,
} = require('./fileCourtIssuedOrderInteractor');
const { User } = require('../../entities/User');

describe('fileCourtIssuedOrderInteractor', () => {
  const mockUserId = applicationContext.getUniqueId();
  const caseRecord = {
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
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
    status: 'New',
    userId: 'ddd6c900-388b-4151-8014-b3378076bfb0',
  };

  beforeEach(() => {
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
        role: ROLES.petitionsClerk,
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    );

    applicationContext.getPersistenceGateway().getUserById.mockReturnValue(
      new User({
        name: 'Emmett Lathrop "Doc" Brown, Ph.D.',
        role: ROLES.petitionsClerk,
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    );

    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(caseRecord);
  });

  it('should throw an error if not authorized', async () => {
    applicationContext.getCurrentUser.mockReturnValue({});

    await expect(
      fileCourtIssuedOrderInteractor({
        applicationContext,
        documentMetadata: {
          caseId: caseRecord.caseId,
          documentType: 'Order to Show Cause',
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  it('should add order document to case', async () => {
    await fileCourtIssuedOrderInteractor({
      applicationContext,
      documentMetadata: {
        caseId: caseRecord.caseId,
        docketNumber: '45678-18',
        documentType: 'Order to Show Cause',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.documents.length,
    ).toEqual(4);
  });

  it('should add order document to case and set freeText to the document title if it is a generic order (eventCode O)', async () => {
    await fileCourtIssuedOrderInteractor({
      applicationContext,
      documentMetadata: {
        caseId: caseRecord.caseId,
        docketNumber: '45678-18',
        documentTitle: 'Order to do anything',
        documentType: 'Order',
        eventCode: 'O',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().getCaseByCaseId,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.documents.length,
    ).toEqual(4);
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.documents[3],
    ).toMatchObject({ freeText: 'Order to do anything' });
  });

  it('should add a generic notice document to case, set freeText to the document title, and set the document to signed', async () => {
    await fileCourtIssuedOrderInteractor({
      applicationContext,
      documentMetadata: {
        caseId: caseRecord.caseId,
        docketNumber: '45678-18',
        documentTitle: 'Notice to be nice',
        documentType: 'Notice',
        eventCode: 'NOT',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCase,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.documents.length,
    ).toEqual(4);
    const result = applicationContext.getPersistenceGateway().updateCase.mock
      .calls[0][0].caseToUpdate.documents[3];
    expect(result).toMatchObject({ freeText: 'Notice to be nice' });
    expect(result.signedAt).toBeTruthy();
  });

  it('should store documentMetadata.documentContents in S3 and delete from data sent to persistence', async () => {
    await fileCourtIssuedOrderInteractor({
      applicationContext,
      documentMetadata: {
        caseId: caseRecord.caseId,
        docketNumber: '45678-18',
        documentContents: 'I am some document contents',
        documentType: 'Order to Show Cause',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda.mock
        .calls[0][0],
    ).toMatchObject({
      useTempBucket: false,
    });
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.documents[3].documentContents,
    ).toBeUndefined();
    expect(
      applicationContext.getPersistenceGateway().updateCase.mock.calls[0][0]
        .caseToUpdate.documents[3],
    ).toMatchObject({
      documentContentsId: expect.anything(),
      draftState: {},
    });
  });

  it('should parse pdf contents', async () => {
    applicationContext.getStorageClient().getObject.mockReturnValue({
      promise: async () => ({
        Body: Buffer.from(getFakeFile()),
      }),
    });

    await fileCourtIssuedOrderInteractor({
      applicationContext,
      documentMetadata: {
        caseId: caseRecord.caseId,
        docketNumber: '45678-18',
        documentTitle: 'TC Opinion',
        documentType: 'T.C. Opinion',
        eventCode: 'TCOP',
        judge: 'Dredd',
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getUtilities().scrapePdfContents.mock.calls[0][0]
        .pdfBuffer instanceof ArrayBuffer,
    ).toEqual(true);

    expect(
      Buffer.from(
        applicationContext.getUtilities().scrapePdfContents.mock.calls[0][0]
          .pdfBuffer,
      )
        .toString()
        .indexOf('%PDF'),
    ).not.toEqual(-1);
  });

  it('should add order document to most recent case message if a parentMessageId is passed in', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseMessageThreadByParentId.mockReturnValue([
        {
          caseId: caseRecord.caseId,
          caseStatus: caseRecord.status,
          caseTitle: PARTY_TYPES.petitioner,
          createdAt: '2019-03-01T21:40:46.415Z',
          docketNumber: caseRecord.docketNumber,
          docketNumberWithSuffix: caseRecord.docketNumber,
          from: 'Test Petitionsclerk',
          fromSection: 'petitions',
          fromUserId: '4791e892-14ee-4ab1-8468-0c942ec379d2',
          message: 'hey there',
          messageId: 'a10d6855-f3ee-4c11-861c-c7f11cba4dff',
          parentMessageId: '31687a1e-3640-42cd-8e7e-a8e6df39ce9a',
          subject: 'hello',
          to: 'Test Petitionsclerk2',
          toSection: 'petitions',
          toUserId: '449b916e-3362-4a5d-bf56-b2b94ba29c12',
        },
      ]);

    await fileCourtIssuedOrderInteractor({
      applicationContext,
      documentMetadata: {
        caseId: caseRecord.caseId,
        docketNumber: '45678-18',
        documentTitle: 'Order to do anything',
        documentType: 'Order',
        eventCode: 'O',
        parentMessageId: '6c1fd626-c1e1-4367-bca6-e00f9ef98cf5',
        signedAt: '2019-03-01T21:40:46.415Z',
        signedByUserId: mockUserId,
        signedJudgeName: 'Dredd',
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().updateCaseMessage,
    ).toHaveBeenCalled();
    expect(
      applicationContext.getPersistenceGateway().updateCaseMessage.mock
        .calls[0][0].caseMessage.attachments,
    ).toEqual([
      {
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentTitle: 'Order to do anything',
      },
    ]);
  });

  it('should throw an error if fails to parse pdf', async () => {
    applicationContext
      .getUtilities()
      .scrapePdfContents.mockImplementation(() => {
        throw new Error('error parsing pdf');
      });

    await expect(
      fileCourtIssuedOrderInteractor({
        applicationContext,
        documentMetadata: {
          caseId: caseRecord.caseId,
          docketNumber: '45678-18',
          documentTitle: 'TC Opinion',
          documentType: 'T.C. Opinion',
          eventCode: 'TCOP',
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('error parsing pdf');
  });
});
