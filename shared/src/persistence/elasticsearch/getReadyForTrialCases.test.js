const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const {
  CASE_STATUS_TYPES,
} = require('../../business/entities/EntityConstants');
const { getReadyForTrialCases } = require('./getReadyForTrialCases');
jest.mock('./searchClient');
const { search } = require('./searchClient');

describe('getReadyForTrialCases', () => {
  it('should search for all cases whose status is `General Docket - Not at Issue`', async () => {
    search.mockResolvedValue({
      results: [{ docketNumber: '102-20' }, { docketNumber: '134-30' }],
      total: 2,
    });

    await getReadyForTrialCases({
      applicationContext,
    });

    expect(search.mock.calls[0][0].searchParameters.body.query).toMatchObject({
      term: {
        'status.S': CASE_STATUS_TYPES.generalDocket,
      },
    });
  });
});
