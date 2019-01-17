const { getCasesForRespondent } = require('./getCasesForRespondent.interactor');
const { omit } = require('lodash');
const { MOCK_CASE } = require('../../../test/mockCase');

describe('Send petition to IRS', () => {
  let applicationContext;

  let caseRecord = MOCK_CASE;

  it('throws an error if the entity returned from persistence is invalid', async () => {
    applicationContext = {
      getPersistenceGateway: () => {
        return {
          getCasesForRespondent: () =>
            Promise.resolve([omit(caseRecord, 'documents')]),
        };
      },
      environment: { stage: 'local' },
    };
    let error;
    try {
      await getCasesForRespondent({
        respondentId: 'respondent',
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
