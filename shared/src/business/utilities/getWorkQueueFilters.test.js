const {
  getDocQcSectionForUser,
  getWorkQueueFilters,
} = require('./getWorkQueueFilters');

describe('getWorkQueueFilters', () => {
  describe('getDocQcSectionForUser', () => {
    it('returns the petitions section if the user is in the petitions section', () => {
      expect(getDocQcSectionForUser({ section: 'petitions' })).toEqual(
        'petitions',
      );
    });

    it('returns the docket section if the user is in any section other than petitions', () => {
      expect(getDocQcSectionForUser({ section: 'adc' })).toEqual('docket');
    });
  });

  describe('getWorkQueueFilters', () => {
    it('returns an object containing a filter map for work queues and boxes', () => {
      const filters = getWorkQueueFilters({
        user: { role: 'petitions', section: 'petitions', userId: '123' },
      });
      expect(filters).toMatchObject({
        my: {
          inProgress: expect.any(Function),
          inbox: expect.any(Function),
          outbox: expect.any(Function),
        },
        section: {
          inProgress: expect.any(Function),
          inbox: expect.any(Function),
          outbox: expect.any(Function),
        },
      });
    });
  });
});
