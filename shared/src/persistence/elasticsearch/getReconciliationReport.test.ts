const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { getReconciliationReport } = require('./getReconciliationReport');
const { PARTIES_CODES } = require('../../business/entities/EntityConstants');
jest.mock('./searchClient');
const { search } = require('./searchClient');

describe('getReconciliationReport', () => {
  it('should search for docket entries that were served between the provided date range and were served to either the respondent or both parties', async () => {
    const mockEndDate = '2018-03-01T00:01:00.000Z';
    const mockStartDate = '2018-05-01T00:01:00.000Z';

    search.mockResolvedValue({
      results: [{ docketNumber: '102-20' }, { docketNumber: '134-30' }],
      total: 2,
    });

    await getReconciliationReport({
      applicationContext,
      reconciliationDateEnd: mockEndDate,
      reconciliationDateStart: mockStartDate,
    });

    expect(search.mock.calls[0][0].searchParameters.body.query).toMatchObject({
      bool: {
        must: [
          {
            terms: {
              'servedPartiesCode.S': [
                PARTIES_CODES.RESPONDENT,
                PARTIES_CODES.BOTH,
              ],
            },
          },
          {
            range: {
              'servedAt.S': {
                format: 'strict_date_time', // ISO-8601 time stamp
                gte: mockStartDate,
                lte: mockEndDate,
              },
            },
          },
        ],
      },
    });
  });
});
