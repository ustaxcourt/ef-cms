const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
} = require('../../business/entities/EntityConstants');
const { getReadyForTrialCases } = require('./getReadyForTrialCases');
jest.mock('./searchClient');
const { search } = require('./searchClient');

describe('getReconciliationReport', () => {
  it('should search for docket entries that were served between the provided date range and were served to either the respondent or both parties', async () => {
    search.mockImplementation(async () => {
      return {
        results: [{ docketNumber: '102-20' }, { docketNumber: '134-30' }],
        total: 2,
      };
    });

    await getReconciliationReport({
      applicationContext,
      reconciliationDateEnd: ,
      reconciliationDateStart: ,
    });

    expect(search.mock.calls[0][0].searchParameters.body.query).toMatchObject({
      term: {
        'status.S': CASE_STATUS_TYPES.generalDocket,
      },
    });
  });
});
