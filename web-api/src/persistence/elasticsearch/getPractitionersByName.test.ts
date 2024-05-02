import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getPractitionersByName } from './getPractitionersByName';

describe('getPractitionersByName', () => {
  it('returns results from a single persistence query', async () => {
    const search = (applicationContext.getSearchClient().search = jest
      .fn()
      .mockResolvedValue({
        body: {
          hits: {
            hits: [
              { barNumber: '009', name: 'other' },
              { barNumber: '005', name: 'matches' },
            ],
          },
        },
      }));

    const { results } = await getPractitionersByName({
      applicationContext,
      name: 'some practitioner name',
      searchAfter: [],
    });
    expect(search).toHaveBeenCalledTimes(1);
    expect(results.length).toBe(2);
  });
});
