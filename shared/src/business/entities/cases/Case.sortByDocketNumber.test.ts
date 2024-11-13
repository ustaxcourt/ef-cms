import { Case } from './Case';

describe('sortByDocketNumber', () => {
  it('Should return the cases as an array sorted by docket number for cases filed in the same year', () => {
    const result = Case.sortByDocketNumber([
      {
        docketNumber: '910-19',
      },
      {
        docketNumber: '1000-19',
      },
      {
        docketNumber: '120-19',
      },
    ]);

    expect(result).toEqual([
      {
        docketNumber: '120-19',
      },
      {
        docketNumber: '910-19',
      },
      {
        docketNumber: '1000-19',
      },
    ]);
  });

  it('Should return the cases as an array sorted by docket number for cases filed in different years', () => {
    const result = Case.sortByDocketNumber([
      {
        docketNumber: '100-19',
      },
      {
        docketNumber: '110-18',
      },
      {
        docketNumber: '120-19',
      },
      {
        docketNumber: '120-95',
      },
      {
        docketNumber: '120-18',
      },
    ]);

    expect(result).toEqual([
      {
        docketNumber: '120-95',
      },
      {
        docketNumber: '110-18',
      },
      {
        docketNumber: '120-18',
      },
      {
        docketNumber: '100-19',
      },
      {
        docketNumber: '120-19',
      },
    ]);
  });
});

describe('sortByDocketNumberAndGroupConsolidatedCases', () => {
  it('Should return the cases sorted properly, with consolidated cases appearing (in sorted order) after their lead cases', () => {
    const result = Case.sortByDocketNumberAndGroupConsolidatedCases([
      {
        docketNumber: '100-19',
      },
      {
        docketNumber: '100-20',
      },
      {
        docketNumber: '101-20', // Comes after 100-20
        leadDocketNumber: '100-19', // But goes with 100-19
      },
      {
        docketNumber: '100-18',
      },
    ]);

    expect(result).toMatchObject([
      { docketNumber: '100-18' },
      {
        docketNumber: '100-19',
      },
      {
        docketNumber: '101-20',
      },
      {
        docketNumber: '100-20',
      },
    ]);
  });
});
