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
});
