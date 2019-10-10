const { getCasesByUserInteractor } = require('./getCasesByUserInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { omit } = require('lodash');

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
      getUniqueId: () => 'c54ba5a9-b37b-479d-9201-067ec6e335bb',
    };
    let error;
    try {
      await getCasesByUserInteractor({
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
