import { compareDateStrings } from './sortFunctions';

describe('sortFunctions', () => {
  describe('compareDateStrings', () => {
    it('should return 0 if the date strings are the same', () => {
      const a = '2019-03-01T21:40:46.415Z';
      const b = '2019-03-01T21:40:46.415Z';
      const result = compareDateStrings(a, b);

      expect(result).toEqual(0);
    });

    it('should return -1 if a is before b', () => {
      const a = '2019-01-01T21:40:46.415Z';
      const b = '2019-03-01T21:40:46.415Z';
      const result = compareDateStrings(a, b);

      expect(result).toEqual(-1);
    });

    it('should return 1 if a is after b', () => {
      const a = '2019-05-01T21:40:46.415Z';
      const b = '2019-03-01T21:40:46.415Z';
      const result = compareDateStrings(a, b);

      expect(result).toEqual(1);
    });
  });
});
