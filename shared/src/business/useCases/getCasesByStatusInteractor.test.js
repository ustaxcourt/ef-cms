const { getCasesByStatus } = require('./getCasesByStatusInteractor');
const { omit } = require('lodash');
const { MOCK_CASE } = require('../../test/mockCase');

describe('getCasesByStatus', () => {
  let applicationContext;

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
          getCasesByStatus: () =>
            Promise.resolve([omit(MOCK_CASE, 'docketNumber')]),
        };
      },
    };
    let error;
    try {
      await getCasesByStatus({
        applicationContext,
        status: 'New',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'The Case entity was invalid ValidationError: child "docketNumber" fails because ["docketNumber" is required]',
    );
  });

  it('throws an error if the user is unauthorized', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          userId: 'nope',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCasesByStatus: () =>
            Promise.resolve([omit(MOCK_CASE, 'documents')]),
        };
      },
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
