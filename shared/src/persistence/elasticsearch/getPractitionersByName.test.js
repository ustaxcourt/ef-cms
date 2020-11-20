const {
  applicationContext,
} = require('../../business/test/createTestApplicationContext');
const { getPractitionersByName } = require('./getPractitionersByName');
jest.mock('./searchClient');
const { search } = require('./searchClient');

describe('getPractitionersByName', () => {
  it('returns results multiple queries, returning uniq values', async () => {
    search
      .mockImplementation(async () => {
        // default behavior
        return {
          results: [
            { barNumber: '009', name: 'other' },
            { barNumber: '005', name: 'matches' },
          ],
          total: 2,
        };
      })
      .mockImplementationOnce(async () => {
        // first call
        return {
          results: [
            { barNumber: '007', name: 'some' },
            { barNumber: '005', name: 'matches' },
          ],
          total: 0,
        };
      });

    const results = await getPractitionersByName({
      applicationContext,
      name: 'some practitioner name',
    });
    expect(search).toHaveBeenCalledTimes(2);
    expect(results.length).toBe(3);
  });
});
