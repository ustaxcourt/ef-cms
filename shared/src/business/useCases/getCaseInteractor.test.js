const assert = require('assert');
const { getCase } = require('./getCaseInteractor');
const sinon = require('sinon');
const { MOCK_CASE } = require('../../test/mockCase');

const documents = MOCK_CASE.documents;

describe('Get case', () => {
  let applicationContext;

  beforeEach(() => {});

  it('Success case by case id', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(MOCK_CASE),
        };
      },
      getCurrentUser: () => {
        return {
          userId: 'petitionsclerk',
          role: 'petitionsclerk',
        };
      },
      environment: { stage: 'local' },
    };
    const caseRecord = await getCase({
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      applicationContext,
    });
    assert.equal(caseRecord.caseId, 'c54ba5a9-b37b-479d-9201-067ec6e335bb');
  });

  it('failure case by case id', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(null),
        };
      },
      getCurrentUser: () => {
        return {
          userId: 'petitionsclerk',
          role: 'petitionsclerk',
        };
      },
      environment: { stage: 'local' },
    };
    try {
      await getCase({
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        petitioners: [{ name: 'Test Taxpayer' }],
        applicationContext,
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
      getPersistenceGateway: () => ({
        getCaseByDocketNumber: getCaseByDocketNumberStub,
      }),
      getCurrentUser: () => {
        return {
          userId: 'petitionsclerk',
          role: 'petitionsclerk',
        };
      },
      environment: { stage: 'local' },
    };

    const caseRecord = await getCase({
      caseId: '00101-00',
      applicationContext,
    });
    assert.equal(caseRecord.caseId, 'c54ba5a9-b37b-479d-9201-067ec6e335bb');
    assert.equal(
      getCaseByDocketNumberStub.getCall(0).args[0].docketNumber,
      '101-00',
    );
  });

  it('failure case by docket number', async () => {
    applicationContext = {
      getPersistenceGateway: () => ({
        getCaseByDocketNumber: () =>
          Promise.resolve({
            docketNumber: '00101-00',
            caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
            petitioners: [{ name: 'Test Taxpayer' }],
            caseType: 'Other',
            procedureType: 'Regular',
            createdAt: new Date().toISOString(),
            preferredTrialCity: 'Washington, D.C.',
            documents,
          }),
      }),
      getCurrentUser: () => {
        return {
          userId: 'petitionsclerk',
          role: 'petitionsclerk',
        };
      },
      environment: { stage: 'local' },
    };
    try {
      await getCase({
        caseId: '00-11111',
        applicationContext,
      });
    } catch (error) {
      assert.equal(error.message, 'Case 00-11111 was not found.');
    }
  });

  it('failure case by invalid user', async () => {
    applicationContext = {
      getPersistenceGateway: () => ({
        getCaseByDocketNumber: () =>
          Promise.resolve([
            {
              docketNumber: '00101-00',
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
              petitioners: [{ name: 'Test Taxpayer' }],
              caseType: 'Other',
              procedureType: 'Regular',
              createdAt: new Date().toISOString(),
              preferredTrialCity: 'Washington, D.C.',
              documents,
            },
          ]),
      }),
      getCurrentUser: () => {
        return {
          userId: 'someone',
        };
      },
      environment: { stage: 'local' },
    };
    try {
      await getCase({
        caseId: '00101-00',
        applicationContext,
      });
    } catch (error) {
      assert.equal(error.message, 'Unauthorized');
    }
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () =>
            Promise.resolve({
              docketNumber: '00101-00',
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
              petitioners: [{ name: 'Test Taxpayer' }],
              hasIrsNotice: false,
              caseType: 'Other',
              partyType: 'Petitioner',
              procedureType: 'Regular',
              createdAt: new Date().toISOString(),
              preferredTrialCity: 'Washington, D.C.',
            }),
        };
      },
      getCurrentUser: () => {
        return {
          userId: 'intakeclerk',
          role: 'intakeclerk',
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await getCase({
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'The Case entity was invalid ValidationError: child "documents" fails because ["documents" must contain at least 1 items]',
    );
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByDocketNumber: () =>
            Promise.resolve({
              docketNumber: '00101-00',
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
              petitioners: [{ name: 'Test Taxpayer' }],
              caseType: 'Other',
              partyType: 'Petitioner',
              procedureType: 'Regular',
              hasIrsNotice: false,
              createdAt: new Date().toISOString(),
              preferredTrialCity: 'Washington, D.C.',
            }),
        };
      },
      getCurrentUser: () => {
        return {
          userId: 'intakeclerk',
          role: 'intakeclerk',
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await getCase({
        caseId: '00101-08',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'The Case entity was invalid ValidationError: child "documents" fails because ["documents" must contain at least 1 items]',
    );
  });
});
