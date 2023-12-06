import { Case } from './Case';

describe('getSortableDocketNumber', () => {
  it('should sort in the correct order', () => {
    const numbers = [
      Case.getSortableDocketNumber('19844-12'),
      Case.getSortableDocketNumber('5520-08'),
      Case.getSortableDocketNumber('1773-11'),
      Case.getSortableDocketNumber('1144-99'),
      Case.getSortableDocketNumber('5242-10'),
      Case.getSortableDocketNumber('1144-05'),
    ].sort((a, b) => a - b);

    expect(numbers).toEqual([
      1999001144, 2005001144, 2008005520, 2010005242, 2011001773, 2012019844,
    ]);
  });

  it('should return undefined if undefined is passed in', () => {
    const result = Case.getSortableDocketNumber();

    expect(result).toBeUndefined();
  });
});
