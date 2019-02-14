const { getCasesForRespondent } = require('./getCasesForRespondent.interactor');
const { omit } = require('lodash');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('Get cases for respondent', () => {
  let applicationContext;

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCasesForRespondent: () =>
            Promise.resolve([omit(MOCK_CASE, 'documents')]),
        };
      },
      getCurrentUser: () => {
        return {
          userId: 'respondent',
          role: 'respondent',
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await getCasesForRespondent({
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
