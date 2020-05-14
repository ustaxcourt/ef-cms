import { gotoRoute } from './helpers';

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
});
