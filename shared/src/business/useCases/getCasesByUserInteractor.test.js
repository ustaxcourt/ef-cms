const { getCasesByUser } = require('./getCasesByUserInteractor');
const { omit } = require('lodash');
const { MOCK_CASE } = require('../../test/mockCase');

describe('Send petition to IRS', () => {
  let applicationContext;

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getPersistenceGateway: () => {
        return {
          getCasesByUser: () =>
            Promise.resolve([omit(MOCK_CASE, 'docketNumber')]),
        };
      },
    };
    let error;
    try {
      await getCasesByUser({
        applicationContext,
        userId: 'petitionsclerk',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'The Case entity was invalid ValidationError: child "docketNumber" fails because ["docketNumber" is required]',
    );
  });
});
