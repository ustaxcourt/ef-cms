import { applicationContext } from './applicationContext';

describe('frozen constants', () => {
  it('should not be able to modify frozen constants', () => {
    const constants = applicationContext.getConstants();
    Object.keys(constants).forEach(key => {
      if (Array.isArray(constants[key])) {
        expect(() => constants[key].push({ something: true })).toThrow(
          TypeError,
        );
      } else if (typeof constants[key] === 'object') {
        expect(() => {
          constants[key].something = true;
        }).toThrow(TypeError);
      } else {
        expect(() => {
          constants[key] = null;
        }).toThrow(TypeError);
      }
    });
  });
});
