import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { count } from './searchClient';
import { getCountOfConsolidatedCases } from './getCountOfConsolidatedCases';
jest.mock('./searchClient');

describe('getCountOfConsolidatedCases', () => {
  const leadDocketNumber = '101-23';
  it('performs a count query to identify the number of cases in a consolidated case', async () => {
    await getCountOfConsolidatedCases({ applicationContext, leadDocketNumber });
    expect(count).toHaveBeenCalledWith({
      applicationContext,
      searchParameters: {
        body: {
          query: {
            term: {
              'leadDocketNumber.S': leadDocketNumber,
            },
          },
        },
        index: 'efcms-case',
      },
    });
  });
  it('returns a number', async () => {
    (count as jest.Mock).mockReturnValue(5);

    const result = await getCountOfConsolidatedCases({
      applicationContext,
      leadDocketNumber,
    });
    expect(result).toBe(5);
  });
});
