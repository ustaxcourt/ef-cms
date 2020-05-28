const {
  getCaseForPublicDocketSearchInteractor,
} = require('./getCaseForPublicDocketSearchInteractor');
const { applicationContext } = require('../test/createTestApplicationContext');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { MOCK_CASE } = require('../../test/mockCase');

describe('Get case for public docket record search', () => {
  it('should search for a case by case id', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(Promise.resolve(MOCK_CASE));

    const caseRecord = await getCaseForPublicDocketSearchInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(caseRecord.caseId).toEqual('c54ba5a9-b37b-479d-9201-067ec6e335bb');
  });

  it('should return null when the found case is sealed', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockResolvedValue({
        ...MOCK_CASE,
        isSealed: true,
        sealedDate: '2020/05/05',
      });

    const caseRecord = await getCaseForPublicDocketSearchInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(caseRecord).toBeNull();
  });

  it('successfully retrieves a case with documents that have documentContents', async () => {
    const mockCaseWithDocumentContents = {
      ...MOCK_CASE,
      documents: [
        {
          createdAt: '2018-11-21T20:49:28.192Z',
          docketNumber: '101-18',
          documentContentsId: '0098d177-78ef-4210-88aa-4bbb45c4f048',
          documentId: 'c6b81f4d-1e47-423a-8caf-6d2fdc3d3859',
          documentTitle: 'Petition',
          documentType: 'Petition',
          draftState: {},
          eventCode: 'P',
          processingStatus: 'pending',
          userId: applicationContext.getUniqueId(),
          workItems: [],
        },
      ],
    };

    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(mockCaseWithDocumentContents);
    applicationContext.getPersistenceGateway().getDocument.mockReturnValue(
      Buffer.from(
        JSON.stringify({
          documentContents: 'the contents!',
          richText: '<b>the contents!</b>',
        }),
      ),
    );

    const caseRecord = await getCaseForPublicDocketSearchInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(
      applicationContext.getPersistenceGateway().getDocument,
    ).toHaveBeenCalledWith({
      applicationContext,
      documentId: '0098d177-78ef-4210-88aa-4bbb45c4f048',
      protocol: 'S3',
      useTempBucket: false,
    });
    expect(caseRecord.documents[0]).toMatchObject({
      documentContents: 'the contents!',
      draftState: {
        documentContents: 'the contents!',
        richText: '<b>the contents!</b>',
      },
    });
  });

  it('failure case by case id', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(Promise.resolve(null));

    await expect(
      getCaseForPublicDocketSearchInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        petitioners: [{ name: 'Test Petitioner' }],
      }),
    ).rejects.toThrow(
      'Case c54ba5a9-b37b-479d-9201-067ec6e335bb was not found.',
    );
  });

  it('success case by docket number', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);

    const caseRecord = await getCaseForPublicDocketSearchInteractor({
      applicationContext,
      caseId: '00101-00',
    });

    expect(caseRecord.caseId).toEqual('c54ba5a9-b37b-479d-9201-067ec6e335bb');
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[0][0].docketNumber,
    ).toEqual('101-00');
  });

  it('failure case by docket number', async () => {
    await expect(
      getCaseForPublicDocketSearchInteractor({
        applicationContext,
        caseId: '00-11111',
      }),
    ).rejects.toThrow('Case 00-11111 was not found.');
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        caseCaption: 'Caption',
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        caseType: 'Other',
        createdAt: new Date().toISOString(),
        partyType: ContactFactory.PARTY_TYPES.petitioner,
        petitioners: [{ name: 'Test Petitioner' }],
        preferredTrialCity: 'Washington, District of Columbia',
        procedureType: 'Regular',
      });

    await expect(
      getCaseForPublicDocketSearchInteractor({
        applicationContext,
        caseId: '00101-08',
      }),
    ).rejects.toThrow('The Case entity was invalid');
  });
});
