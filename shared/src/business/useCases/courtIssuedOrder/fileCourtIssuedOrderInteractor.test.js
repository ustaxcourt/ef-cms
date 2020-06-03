const {
  applicationContext,
  getFakeFile,
} = require('../../test/createTestApplicationContext');
const {
  fileCourtIssuedOrderInteractor,
} = require('./fileCourtIssuedOrderInteractor');
const { User } = require('../../entities/User');

describe('fileCourtIssuedOrderInteractor', () => {
  const caseRecord = {
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
        documentType: 'Answer',
        userId: 'irsPractitioner',
      },
      {
        docketNumber: '45678-18',
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        documentType: 'Answer',
        userId: 'irsPractitioner',
      },
      {
        docketNumber: '45678-18',
        documentId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
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
    applicationContext.getCurrentUser.mockReturnValue(
      new User({
        name: 'Olivia Jade',
        role: User.ROLES.petitionsClerk,
        userId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    );

    applicationContext.getPersistenceGateway().getUserById.mockReturnValue(
      new User({
        name: 'Olivia Jade',
        role: User.ROLES.petitionsClerk,
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
        draftState: {
          documentContents: 'I am some document contents',
          editorDelta: 'I am some document contents',
          richText: 'I am some document contents',
        },
      },
      primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().saveDocumentFromLambda,
    ).toHaveBeenCalled();
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
        documentType: 'TCOP - T.C. Opinion',
        eventCode: 'TCOP',
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
          documentType: 'TCOP - T.C. Opinion',
          eventCode: 'TCOP',
        },
        primaryDocumentFileId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      }),
    ).rejects.toThrow('error parsing pdf');
  });
});
