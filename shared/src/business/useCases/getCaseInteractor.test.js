const { applicationContext } = require('../test/createTestApplicationContext');
const { getCaseInteractor } = require('./getCaseInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { PARTY_TYPES, ROLES } = require('../entities/EntityConstants');
const { documents } = MOCK_CASE;

const petitionsclerkId = '23c4d382-1136-492f-b1f4-45e893c34771';
const petitionerId = '273f5d19-3707-41c0-bccc-449c52dfe54e';
const irsPractitionerId = '6cf19fba-18c6-467a-9ea6-7a14e42add2f';
const practitionerId = '295c3640-7ff9-40bb-b2f1-8117bba084ea';
const practitioner2Id = '42614976-4228-49aa-a4c3-597dae1c7220';

describe('Get case', () => {
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
          filedBy: 'Test Petitioner',
          processingStatus: 'pending',
          userId: petitionerId,
          workItems: [],
        },
      ],
    };
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: petitionsclerkId,
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(mockCaseWithDocumentContents);
    applicationContext.getPersistenceGateway().getDocument.mockReturnValue(
      Buffer.from(
        JSON.stringify({
          documentContents: 'the contents!',
          richText: '<b>the contents!</b>',
        }),
      ),
    );

    const caseRecord = await getCaseInteractor({
      applicationContext,
      docketNumber: '123-19',
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
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: petitionsclerkId,
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(Promise.resolve(null));

    await expect(
      getCaseInteractor({
        applicationContext,
        docketNumber: '123-19',
      }),
    ).rejects.toThrow('Case 123-19 was not found.');
  });

  it('success case by docket number', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: petitionsclerkId,
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);

    const caseRecord = await getCaseInteractor({
      applicationContext,
      docketNumber: '101-00',
    });

    expect(caseRecord.caseId).toEqual('c54ba5a9-b37b-479d-9201-067ec6e335bb');
    expect(
      applicationContext.getPersistenceGateway().getCaseByDocketNumber.mock
        .calls[0][0].docketNumber,
    ).toEqual('101-00');
  });

  it('failure case by docket number', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(undefined);
    await expect(
      getCaseInteractor({
        applicationContext,
        docketNumber: '00-11111',
      }),
    ).rejects.toThrow('Case 00-11111 was not found.');
  });

  it('failure case by invalid user', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      userId: 'someone',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue(
        Promise.resolve([
          {
            caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            caseType: 'Other',
            createdAt: new Date().toISOString(),
            docketNumber: '101-00',
            documents,
            petitioners: [{ name: 'Test Petitioner' }],
            preferredTrialCity: 'Washington, District of Columbia',
            procedureType: 'Regular',
          },
        ]),
      );

    await expect(
      getCaseInteractor({
        applicationContext,
        docketNumber: '00101-00',
      }),
    ).rejects.toThrow('Unauthorized');
  });

  describe('permissions-filtered access', () => {
    beforeAll(() => {
      applicationContext
        .getPersistenceGateway()
        .getCaseByDocketNumber.mockReturnValue(
          Promise.resolve({
            ...MOCK_CASE,
            caseCaption: 'a case caption',
            caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            caseType: 'Other',
            createdAt: new Date().toISOString(),
            docketNumber: '101-18',
            documents,
            irsPractitioners: [
              { role: ROLES.irsPractitioner, userId: irsPractitionerId },
            ],
            petitioners: [{ name: 'Test Petitioner' }],
            preferredTrialCity: 'Washington, District of Columbia',
            privatePractitioners: [
              { role: ROLES.privatePractitioner, userId: practitionerId },
            ],
            procedureType: 'Regular',
            sealedDate: new Date().toISOString(),
          }),
        );
    });

    it('restricted case by inadequate permissions', async () => {
      applicationContext.getCurrentUser.mockReturnValue({
        role: ROLES.privatePractitioner,
        userId: 'practitioner2',
      });

      let error, result;
      try {
        result = await getCaseInteractor({
          applicationContext,
          docketNumber: '101-18',
        });
      } catch (err) {
        error = err;
        console.log(err.stack);
      }

      expect(error).not.toBeDefined();
      expect(result).toMatchObject({ isSealed: true });
    });

    it('full case access via sealed case permissions', async () => {
      applicationContext.getCurrentUser.mockReturnValue({
        role: ROLES.docketClerk,
        userId: practitioner2Id,
      });

      let error, result;
      try {
        result = await getCaseInteractor({
          applicationContext,
          docketNumber: '00101-18',
        });
      } catch (err) {
        error = err;
        console.log(err.stack);
      }

      expect(error).not.toBeDefined();
      expect(result).toMatchObject({
        caseCaption: 'a case caption',
        sealedDate: expect.anything(),
      });
    });
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: ROLES.petitionsClerk,
      userId: petitionsclerkId,
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        caseCaption: 'Caption',
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        caseType: 'Other',
        createdAt: new Date().toISOString(),
        partyType: PARTY_TYPES.petitioner,
        petitioners: [{ name: 'Test Petitioner' }],
        preferredTrialCity: 'Washington, District of Columbia',
        procedureType: 'Regular',
      });

    await expect(
      getCaseInteractor({
        applicationContext,
        docketNumber: '00101-08',
      }),
    ).rejects.toThrow('The Case entity was invalid');
  });
});
