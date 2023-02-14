import { makeMap } from './makeMap';

describe('makeMap', () => {
  describe('collection is undefined', () => {
    it('should return an empty object', () => {
      expect(makeMap()).toEqual({});
    });
  });

  describe('value is array', () => {
    it('should make a mapped object based off the object key.', () => {
      expect(
        makeMap(
          [
            { firstName: 'William' },
            { firstName: 'Doug' },
            { firstName: 'Jeff' },
          ],
          'firstName',
        ),
      ).toEqual({
        Doug: { firstName: 'Doug' },
        Jeff: { firstName: 'Jeff' },
        William: { firstName: 'William' },
      });
    });
  });
});
