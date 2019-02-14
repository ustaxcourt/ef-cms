const { getCasesByStatus } = require('./getCasesByStatus.interactor');
const { omit } = require('lodash');
const { MOCK_CASE } = require('../../test/mockCase');

describe('getCasesByStatus', () => {
  let applicationContext;

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCasesByStatus: () =>
            Promise.resolve([omit(MOCK_CASE, 'documents')]),
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
    let error;
    try {
      await getCasesByStatus({
        status: 'New',
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'The Case entity was invalid ValidationError: child "documents" fails because ["documents" must contain at least 1 items]',
    );
  });

  it('throws an error if the user is unauthorized', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCasesByStatus: () =>
            Promise.resolve([omit(MOCK_CASE, 'documents')]),
        };
      },
      getCurrentUser: () => {
        return {
          userId: 'nope',
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await getCasesByStatus({
        applicationContext,
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain('Unauthorized for getCasesByStatus');
  });
});
