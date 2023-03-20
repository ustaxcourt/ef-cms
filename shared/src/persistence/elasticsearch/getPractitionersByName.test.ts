const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { getPractitionersByName } = require('./getPractitionersByName');
jest.mock('./searchClient');
const { search } = require('./searchClient');

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
