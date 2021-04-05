const { getOnly } = require('./helpers');

describe('helpers', () => {
  describe('getOnly', () => {
    let urlsWithOnly;
    let urlsWithoutOnly;

    beforeAll(() => {
      urlsWithOnly = [
        {
          only: true,
          url: 'http://example.com/2',
        },
        {
          only: true,
          url: 'http://example.com/5',
        },
      ];

      urlsWithoutOnly = [
        {
          only: false,
          url: 'http://example.com/1',
        },

        'http://example.com/3',
        'http://example.com/4',

        {
          only: undefined,
          url: 'http://example.com/6',
        },
        {
          url: 'http://example.com/7',
        },
      ];
    });

    it('looks at the given array for objects containing a truthy only param and returns those items', () => {
      const result = getOnly([...urlsWithOnly, ...urlsWithoutOnly]);
      expect(result).toMatchObject([
        {
          only: true,
          url: 'http://example.com/2',
        },
        {
          only: true,
          url: 'http://example.com/5',
        },
      ]);
    });

    it('returns all elements in the given array if none have a truthy `only` param', () => {
      const result = getOnly(urlsWithoutOnly);

      expect(result).toEqual(urlsWithoutOnly);
    });
  });
});
