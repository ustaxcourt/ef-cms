const assert = require('assert');
const {
  sendPetitionToIRSHoldingQueue,
} = require('./sendPetitionToIRSHoldingQueue.interactor');
const { getCase } = require('./getCase.interactor');
const { omit } = require('lodash');
const { MOCK_CASE } = require('../../test/mockCase');

describe('Send petition to IRS Holding Queue', () => {
  let applicationContext;

  applicationContext = {
    getPersistenceGateway: () => {
      return {
        getCaseByCaseId: () => Promise.resolve(MOCK_CASE),
        saveCase: () => Promise.resolve(MOCK_CASE),
      };
    },
    environment: { stage: 'local' },
    getUseCases: () => ({ getCase }),
  };

  it('throws unauthorized error if user is unauthorized', async () => {
    let error;
    try {
      await sendPetitionToIRSHoldingQueue({
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userId: 'someuser',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'Unauthorized for send to IRS Holding Queue',
    );
  });

  it('case not found if caseId does not exist', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          saveCase: () => null,
          getCaseByCaseId: () => null,
        };
      },
      environment: { stage: 'local' },
      getUseCases: () => ({ getCase }),
    };
    let error;
    try {
      await sendPetitionToIRSHoldingQueue({
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335ba',
        userId: 'petitionsclerk',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    assert.ok(error);
    expect(error.message).toContain(
      'Case c54ba5a9-b37b-479d-9201-067ec6e335ba was not found',
    );
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCaseByCaseId: () => Promise.resolve(omit(MOCK_CASE, 'documents')),
        };
      },
      environment: { stage: 'local' },
      getUseCases: () => ({ getCase }),
    };
    let error;
    try {
      await sendPetitionToIRSHoldingQueue({
        caseId: 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
        userId: 'petitionsclerk',
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
