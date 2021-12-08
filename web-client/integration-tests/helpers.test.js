import { embedWithLegalIpsumText, gotoRoute } from './helpers';
import { getTextByCount } from '../../shared/src/business/utilities/getTextByCount';

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

  describe('getTextByCount', () => {
    it('should return dummy text with the given character count', () => {
      const dummyText1 = getTextByCount(100);
      const dummyText2 = getTextByCount(202);
      const dummyText3 = getTextByCount(3003);

      expect(dummyText1.length).toEqual(100);
      expect(dummyText2.length).toEqual(202);
      expect(dummyText3.length).toEqual(3003);
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
});
