const sinon = require('sinon');
const { ContactFactory } = require('../entities/contacts/ContactFactory');
const { getCaseInteractor } = require('./getCaseInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { User } = require('../entities/User');
const { documents } = MOCK_CASE;

describe('Get case', () => {
  let applicationContext;

  beforeEach(() => {});

  it('Success case by case id', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitionsClerk,
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(MOCK_CASE),
        };
      },
    };
    const caseRecord = await getCaseInteractor({
      applicationContext,
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    });
    expect(caseRecord.caseId).toEqual('c54ba5a9-b37b-479d-9201-067ec6e335bb');
  });

  it('failure case by case id', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitionsClerk,
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(null),
        };
      },
    };
    try {
      await getCaseInteractor({
        applicationContext,
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        petitioners: [{ name: 'Test Petitioner' }],
      });
    } catch (error) {
      expect(error.message).toEqual(
        'Case c54ba5a9-b37b-479d-9201-067ec6e335bb was not found.',
      );
    }
  });

  it('success case by docket number', async () => {
    const getCaseByDocketNumberStub = sinon.stub().resolves(MOCK_CASE);
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitionsClerk,
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => ({
        getCaseByDocketNumber: getCaseByDocketNumberStub,
      }),
    };

    const caseRecord = await getCaseInteractor({
      applicationContext,
      caseId: '00101-00',
    });
    expect(caseRecord.caseId).toEqual('c54ba5a9-b37b-479d-9201-067ec6e335bb');
    expect(getCaseByDocketNumberStub.getCall(0).args[0].docketNumber).toEqual(
      '101-00',
    );
  });

  it('failure case by docket number', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitionsClerk,
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => ({
        getCaseByDocketNumber: () =>
          Promise.resolve({
            caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            caseType: 'Other',
            createdAt: new Date().toISOString(),
            docketNumber: '00101-00',
            documents,
            petitioners: [{ name: 'Test Petitioner' }],
            preferredTrialCity: 'Washington, District of Columbia',
            procedureType: 'Regular',
          }),
      }),
    };
    let error;
    try {
      await getCaseInteractor({
        applicationContext,
        caseId: '00-11111',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.message).toEqual('Case 00-11111 was not found.');
  });

  it('failure case by invalid user', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          userId: 'someone',
        };
      },
      getPersistenceGateway: () => ({
        getCaseByDocketNumber: () =>
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
      }),
    };
    let error;
    try {
      await getCaseInteractor({
        applicationContext,
        caseId: '00101-00',
      });
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.message).toEqual('Unauthorized');
  });
  describe('permissions-filtered access', () => {
    let user;
    beforeEach(() => {
      user = {
        role: User.ROLES.practitioner,
        userId: 'practitioner2',
      };
      applicationContext = {
        environment: { stage: 'local' },
        getCurrentUser: () => {
          return user;
        },
        getPersistenceGateway: () => ({
          getCaseByDocketNumber: () =>
            Promise.resolve({
              ...MOCK_CASE,
              caseCaption: 'a case caption',
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
              caseTitle: 'a case title',
              caseType: 'Other',
              createdAt: new Date().toISOString(),
              docketNumber: '00101-18',
              documents,
              petitioners: [{ name: 'Test Petitioner' }],
              practitioners: [{ userId: 'practitioner' }],
              preferredTrialCity: 'Washington, District of Columbia',
              procedureType: 'Regular',
              respondents: [{ userId: 'respondent' }],
              sealedDate: new Date().toISOString(),
            }),
        }),
        getUniqueId: () => '6',
      };
    });
    it('restricted case by inadequate permissions', async () => {
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
      let error, result;
      user.role = User.ROLES.docketClerk;
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
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: User.ROLES.petitionsClerk,
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCaseByDocketNumber: () =>
            Promise.resolve({
              caseCaption: 'Caption',
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
              caseType: 'Other',
              createdAt: new Date().toISOString(),
              hasIrsNotice: false,
              partyType: ContactFactory.PARTY_TYPES.petitioner,
              petitioners: [{ name: 'Test Petitioner' }],
              preferredTrialCity: 'Washington, District of Columbia',
              procedureType: 'Regular',
            }),
        };
      },
    };
    let error;
    try {
      await getCaseInteractor({
        applicationContext,
        caseId: '00101-08',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'The Case entity was invalid ValidationError: "docketNumber" is required',
    );
  });
});
