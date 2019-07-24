const sinon = require('sinon');
const { getCaseInteractor } = require('./getCaseInteractor');
const { MOCK_CASE } = require('../../test/mockCase');

const { documents } = MOCK_CASE;

describe('Get case', () => {
  let applicationContext;

  beforeEach(() => {});

  it('Success case by case id', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitionsclerk',
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
          role: 'petitionsclerk',
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
        petitioners: [{ name: 'Test Taxpayer' }],
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
          role: 'petitionsclerk',
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
          role: 'petitionsclerk',
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
            petitioners: [{ name: 'Test Taxpayer' }],
            preferredTrialCity: 'Washington, D.C.',
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
              petitioners: [{ name: 'Test Taxpayer' }],
              preferredTrialCity: 'Washington, D.C.',
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

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'petitionsclerk',
          userId: 'petitionsclerk',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCaseByDocketNumber: () =>
            Promise.resolve({
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
              caseType: 'Other',
              createdAt: new Date().toISOString(),
              hasIrsNotice: false,
              partyType: 'Petitioner',
              petitioners: [{ name: 'Test Taxpayer' }],
              preferredTrialCity: 'Washington, D.C.',
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
      'The Case entity was invalid ValidationError: child "docketNumber" fails because ["docketNumber" is required]',
    );
  });
});
