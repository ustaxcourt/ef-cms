import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { count } from './searchClient';
import { getCountOfConsolidedCases } from './getCountOfConsolidedCases';
jest.mock('./searchClient');

describe('getCountOfConsolidedCases', () => {
  const leadDocketNumber = '101-23';
  it('performs a count query to identify the number of cases in a consolidated case', async () => {
    await getCountOfConsolidedCases({ applicationContext, leadDocketNumber });
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

    const result = await getCountOfConsolidedCases({
      applicationContext,
      leadDocketNumber,
    });
    expect(result).toBe(5);
  });
});
