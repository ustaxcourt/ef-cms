const { getCasesForRespondent } = require('./getCasesForRespondentInteractor');
const { MOCK_CASE } = require('../../../test/mockCase');
const { omit } = require('lodash');

describe('Get cases for respondent', () => {
  let applicationContext;

  it('throws an error if user is unauthorized', async () => {
    const applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'docketclerk',
          userId: 'docketclerk',
        };
      },
    };
    await expect(
      getCasesForRespondent({
        applicationContext,
        respondentId: 'respondent',
      }),
    ).rejects.toThrow();
  });

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      environment: { stage: 'local' },
      getCurrentUser: () => {
        return {
          role: 'respondent',
          userId: 'respondent',
        };
      },
      getPersistenceGateway: () => {
        return {
          getCasesForRespondent: () =>
            Promise.resolve([omit(MOCK_CASE, 'docketNumber')]),
        };
      },
    };
    let error;
    try {
      await getCasesForRespondent({
        applicationContext,
        respondentId: 'respondent',
      });
    } catch (err) {
      error = err;
    }
    expect(error.message).toContain(
      'The Case entity was invalid ValidationError: child "docketNumber" fails because ["docketNumber" is required]',
    );
  });
});
