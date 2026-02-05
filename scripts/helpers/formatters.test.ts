import {
  alphabetizeCities,
  formatCaseCaption,
  formatCurrency,
  formatDate,
  formatJudgeName,
  formatMMDDYYYY,
} from './formatters';

describe('formatJudgeName', () => {
  it('should remove titles from judge names', () => {
    expect(formatJudgeName('Chief Special Trial Judge Buch')).toBe('Buch');
    expect(formatJudgeName('Special Trial Judge Cohen')).toBe('Cohen');
    expect(formatJudgeName('Judge Ashford')).toBe('Ashford');
  });

  it('should handle undefined', () => {
    expect(formatJudgeName(undefined)).toBe('');
  });
});

describe('formatCaseCaption', () => {
  it('should remove line breaks and trim the caption', () => {
    expect(formatCaseCaption('Jane Doe, \n Petitioner')).toBe(
      'Jane Doe,   Petitioner',
    );
  });

  it('should handle undefined', () => {
    expect(formatCaseCaption(undefined)).toBe('');
  });
});

describe('alphabetizeCities', () => {
  it('should sort cities by state and then by city', () => {
    const cities = [
      'Phoenix, Arizona',
      'Mobile, Alabama',
      'Birmingham, Alabama',
      'Anchorage, Alaska',
    ];
    const sorted = alphabetizeCities(cities);
    expect(sorted).toEqual([
      'Birmingham, Alabama',
      'Mobile, Alabama',
      'Anchorage, Alaska',
      'Phoenix, Arizona',
    ]);
  });

  it('should handle cities without a state (e.g., Standalone Remote)', () => {
    const cities = [
      'Standalone Remote',
      'Mobile, Alabama',
      'Birmingham, Alabama',
    ];
    const sorted = alphabetizeCities(cities);
    expect(sorted).toEqual([
      'Birmingham, Alabama',
      'Mobile, Alabama',
      'Standalone Remote',
    ]);
  });
});

describe('formatDate', () => {
  it('should format date strings as YYYY-MM-DD', () => {
    expect(formatDate('2020-01-01T05:00:00Z')).toBe('2020-01-01');
  });

  it('should handle Date objects', () => {
    // eslint-disable-next-line custom-rules-plugin/no-dates
    const date = new Date('2020-01-01T05:00:00Z');
    expect(formatDate(date)).toBe('2020-01-01');
  });

  it('should handle undefined', () => {
    expect(formatDate(undefined)).toBe('');
  });
});

describe('formatCurrency', () => {
  it('should format numbers to two decimal places', () => {
    expect(formatCurrency(123.4)).toBe('123.40');
    expect(formatCurrency('123.4')).toBe('123.40');
    expect(formatCurrency(123.399999999)).toBe('123.40');
    expect(formatCurrency('123.400000001')).toBe('123.40');
  });

  it('should handle undefined', () => {
    expect(formatCurrency(undefined)).toBe('0');
  });
});

describe('formatMMDDYYYY', () => {
  it('should format date strings as MMDDYYYY', () => {
    expect(formatMMDDYYYY('2020-01-01T05:00:00Z')).toBe('01/01/2020');
  });

  it('should handle undefined', () => {
    expect(formatMMDDYYYY(undefined)).toBe('');
  });
});
