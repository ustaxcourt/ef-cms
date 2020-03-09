import { getStringAbbreviation } from './getStringAbbreviation';

describe('getStringAbbreviation', () => {
  const LEELOO = 'Leeloo Minai Lekarariba-Laminai-Tchai Ekbat De Sebat';
  it('should return original string if length is below maxCharacters', () => {
    const result = getStringAbbreviation(LEELOO, LEELOO.length + 1);
    expect(result).toEqual(LEELOO);
  });

  describe('performs abbreviations as expected', () => {
    it('with no ellipsis', () => {
      const result = getStringAbbreviation(LEELOO, LEELOO.length - 1, false);
      expect(result).toEqual(
        'Leeloo Minai Lekarariba-Laminai-Tchai Ekbat De Seba',
      );
    });
    it('with an ellipsis', () => {
      const result = getStringAbbreviation(LEELOO, 30, true);
      expect(result).toEqual('Leeloo Minai Lekarariba-Lamina…');
    });
  });
});
