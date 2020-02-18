const { getCasesByUserInteractor } = require('./getCasesByUserInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { MOCK_USERS } = require('../../test/mockUsers');
const { omit } = require('lodash');

describe('Send petition to IRS', () => {
  let applicationContext;

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => MOCK_USERS['a7d90c05-f6cd-442c-a168-202db587f16f'],
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
      'The Case entity was invalid ValidationError: "docketNumber" is required',
    );
  });
});
