import { applicationContext } from '../../../../shared/src/business/test/createTestApplicationContext';
import { getPractitionersByName } from './getPractitionersByName';
jest.mock('./searchClient');
import { search } from './searchClient';

describe('getPractitionersByName', () => {
  it('returns results from a single persistence query', async () => {
    search.mockImplementation(() =>
      Promise.resolve({
        results: [
          { barNumber: '009', name: 'other' },
          { barNumber: '005', name: 'matches' },
        ],
        total: 2,
      }),
    );

    const results = await getPractitionersByName({
      applicationContext,
      name: 'some practitioner name',
    });
    expect(search).toHaveBeenCalledTimes(1);
    expect(results.length).toBe(2);
  });
});
