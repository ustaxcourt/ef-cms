const assert = require('assert');
const { getCase } = require('./getCase.interactor');
const sinon = require('sinon');
const { MOCK_DOCUMENTS } = require('../../test/mockDocuments');

const documents = MOCK_DOCUMENTS;

describe('Get case', () => {
  let applicationContext;

  beforeEach(() => {});

  it('Success case by case id', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () =>
            Promise.resolve({
              docketNumber: '101-18',
              caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
              documents,
            }),
        };
      },
      environment: { stage: 'local' },
    };
    const caseRecord = await getCase({
      userId: 'petitionsclerk',
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
      environment: { stage: 'local' },
    };
    try {
      await getCase({
        userId: 'petitionsclerk',
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        applicationContext,
      });
    } catch (error) {
      assert.equal(
        error.message,
        'Case c54ba5a9-b37b-479d-9201-067ec6e335bb was not found.',
      );
    }
  });

  it('success case by docket number', async () => {
    const getCaseByDocketNumberStub = sinon.stub().resolves({
      docketNumber: '00101-00',
      caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
      documents,
    });
    applicationContext = {
      getPersistenceGateway: () => ({
        getCaseByDocketNumber: getCaseByDocketNumberStub,
      }),
      environment: { stage: 'local' },
    };
    const caseRecord = await getCase({
      userId: 'petitionsclerk',
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
            documents,
          }),
      }),
      environment: { stage: 'local' },
    };
    try {
      await getCase({
        userId: 'petitionsclerk',
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
              documents,
            },
          ]),
      }),
      environment: { stage: 'local' },
    };
    try {
      await getCase({
        userId: 'someone',
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
            }),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await getCase({
        userId: 'intakeclerk',
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
            }),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await getCase({
        userId: 'intakeclerk',
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
