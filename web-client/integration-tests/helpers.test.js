import {
  embedWithLegalIpsumText,
  gotoRoute,
  verifySortedReceivedAtDateOfPendingItems,
} from './helpers';

describe('helpers', () => {
  describe('gotoRoute', () => {
    it('should invoke the expected documents route definition', async () => {
      const cbSpy = jest.fn().mockResolvedValue('awesome');
      const routes = [
        {
          cb: cbSpy,
          route: '/case-detail/*/documents/*',
        },
      ];
      const results = await gotoRoute(
        routes,
        '/case-detail/abc-123-Z/documents/123-ABC-T',
      );
      expect(results).toEqual('awesome');
      expect(cbSpy).toHaveBeenCalledWith('abc-123-Z', '123-ABC-T');
    });

    it('should invoke the expected messages route definition', async () => {
      const cbSpy = jest.fn().mockResolvedValue('awesome');
      const routes = [
        {
          cb: cbSpy,
          route: '/messages..',
        },
      ];
      const results = await gotoRoute(routes, '/messages/section/inbox');
      expect(results).toEqual('awesome');
      expect(cbSpy).toHaveBeenCalledWith('/section/inbox');
    });

    it('should invoke the expected root route definition', async () => {
      const cbSpy = jest.fn().mockResolvedValue('awesome');
      const routes = [
        {
          cb: cbSpy,
          route: '/',
        },
        {
          cb: () => null,
          route: '/messages..',
        },
      ];
      const results = await gotoRoute(routes, '/');
      expect(results).toEqual('awesome');
      expect(cbSpy).toHaveBeenCalled();
    });
  });

  describe('embedWithLegalIpsumText', () => {
    it('returns some pre-defined dummy text with the given phrase embedded', () => {
      const text = embedWithLegalIpsumText('podcasts about peanut butter');

      expect(text).toContain('While this license do not apply to');
      expect(text).toContain('podcasts about peanut butter');
      expect(text).toContain('related documents be drafted in English');
    });
  });

  describe('verifySortedReceivedAtDateOfPendingItems', () => {
    const sortedISODates = [
      {
        receivedAt: '1980-01-01T05:00:00.000Z',
      },
      {
        receivedAt: '1989-01-01T05:00:00.000Z',
      },
      {
        receivedAt: '1990-01-01T05:00:00.000Z',
      },
      {
        receivedAt: '1998-01-01T05:00:00.000Z',
      },
    ];
    it('should return true if ISO dates of pending items are sorted chronologically', () => {
      const isSorted = verifySortedReceivedAtDateOfPendingItems(sortedISODates);
      expect(isSorted).toEqual(true);
    });
    it('should return false if ISO dates of pending items are not sorted chronologically', () => {
      sortedISODates.unshift({
        receivedAt: '1999-01-01T05:00:00.000Z',
      });
      const unsortedISODates = sortedISODates;
      const isSorted =
        verifySortedReceivedAtDateOfPendingItems(unsortedISODates);
      expect(isSorted).toEqual(false);
    });
  });
});
