const { applicationContext } = require('../test/createTestApplicationContext');
const { getCasesByUserInteractor } = require('./getCasesByUserInteractor');
const { MOCK_CASE } = require('../../test/mockCase');
const { omit } = require('lodash');

describe('Send petition to IRS', () => {
  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext
      .getPersistenceGateway()
      .getCasesByUser.mockReturnValue(
        Promise.resolve([omit(MOCK_CASE, 'docketNumber')]),
      );
    let error;

    try {
      await getCasesByUserInteractor({
        applicationContext,
        userId: 'petitionsclerk',
      });
    } catch (err) {
      error = err;
    }

    expect(error.message).toContain('The Case entity was invalid');
  });
});
