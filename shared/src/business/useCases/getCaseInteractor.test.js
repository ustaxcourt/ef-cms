const { applicationContext } = require('../test/createTestApplicationContext');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { getCaseInteractor } = require('./getCaseInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');
const { documents } = MOCK_CASE;

describe('Get case', () => {
  it('success case by case id', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(Promise.resolve(MOCK_CASE));

    const caseRecord = await getCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });

    expect(caseRecord.caseId).toEqual('c54ba5a9-b37b-479d-9201-067ec6e335bb');
  });

  it('failure case by case id', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByCaseId.mockReturnValue(Promise.resolve(null));

    await expect(
      getCaseInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        petitioners: [{ name: 'Test Petitioner' }],
      }),
    ).rejects.toThrow(
      'Case c54ba5a9-b37b-479d-9201-067ec6e335bb was not found.',
    );
  });

  it('success case by docket number', async () => {
    applicationContext.getCurrentUser.mockReturnValue({
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockResolvedValue(MOCK_CASE);

    const caseRecord = await getCaseInteractor({
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
      getCaseInteractor({
        applicationContext,
        caseId: '00-11111',
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
            docketNumber: '00101-00',
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
        caseId: '00101-00',
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
            docketNumber: '00101-18',
            documents,
            irsPractitioners: [{ userId: 'irsPractitioner' }],
            petitioners: [{ name: 'Test Petitioner' }],
            preferredTrialCity: 'Washington, District of Columbia',
            privatePractitioners: [{ userId: 'practitioner' }],
            procedureType: 'Regular',
            sealedDate: new Date().toISOString(),
          }),
        );
    });

    it('restricted case by inadequate permissions', async () => {
      applicationContext.getCurrentUser.mockReturnValue({
        role: User.ROLES.privatePractitioner,
        userId: 'practitioner2',
      });

      let error, result;
      try {
        result = await getCaseInteractor({
          applicationContext,
          caseId: '00101-18',
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
        role: User.ROLES.docketClerk,
        userId: 'practitioner2',
      });

      let error, result;
      try {
        result = await getCaseInteractor({
          applicationContext,
          caseId: '00101-18',
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
      role: User.ROLES.petitionsClerk,
      userId: 'petitionsclerk',
    });
    applicationContext
      .getPersistenceGateway()
      .getCaseByDocketNumber.mockReturnValue({
        caseCaption: 'Caption',
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        caseType: 'Other',
        createdAt: new Date().toISOString(),
        hasIrsNotice: false,
        partyType: ContactFactory.PARTY_TYPES.petitioner,
        petitioners: [{ name: 'Test Petitioner' }],
        preferredTrialCity: 'Washington, District of Columbia',
        procedureType: 'Regular',
      });

    await expect(
      getCaseInteractor({
        applicationContext,
        caseId: '00101-08',
      }),
    ).rejects.toThrow('The Case entity was invalid');
  });
});
