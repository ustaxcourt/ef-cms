import { getFullStateName } from './getFullStateName';

describe('getFullStateName', () => {
  it('returns the full state name for a state abbreviation', () => {
    expect(getFullStateName('TN')).toBe('Tennessee');
  });

  it('returns the full state name for a US_STATES_OTHER abbreviation', () => {
    expect(getFullStateName('GU')).toBe('Guam');
  });

  it('returns the original value when the abbreviation is unknown', () => {
    expect(getFullStateName('ZZ')).toBe('ZZ');
  });

  it('returns undefined when no abbreviation is provided', () => {
    expect(getFullStateName(undefined)).toBeUndefined();
  });
});
