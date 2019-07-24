import { mapValueHelper } from './mapValueHelper';

describe('mapValueHelper', () => {
  describe('value is undefined', () => {
    it('should return an empty object', () => {
      expect(mapValueHelper()).toEqual({});
    });
  });

  describe('value is string', () => {
    it('should map the value into an object property with the value true', () => {
      expect(mapValueHelper('something')).toEqual({ something: true });
    });

    it('should map the value into an camel-cased object property with the value true', () => {
      expect(mapValueHelper('some thing')).toEqual({ someThing: true });
    });
  });

  describe('value is boolean', () => {
    it('should map the value into an object property named true with the value true', () => {
      expect(mapValueHelper(true)).toEqual({ true: true });
    });

    it('should map the value into an object property named false with the value true', () => {
      expect(mapValueHelper(false)).toEqual({ false: true });
    });
  });

  describe('value is number', () => {
    it('should map the value as a string into an object property with the value true', () => {
      expect(mapValueHelper(8675309)).toEqual({ '8675309': true });
    });
  });

  describe('value is array', () => {
    it('should map each item as property of index and map the value of each item.', () => {
      expect(mapValueHelper([true, false, 'something', 8675309])).toEqual({
        '0': { true: true },
        '1': { false: true },
        '2': { something: true },
        '3': { '8675309': true },
      });
    });
  });

  describe('value is object', () => {
    it('should map each item as property and map the value of each item.', () => {
      expect(mapValueHelper({ firstName: 'Josh', lastName: 'Allen' })).toEqual({
        firstName: { josh: true },
        lastName: { allen: true },
      });
    });
  });
});
