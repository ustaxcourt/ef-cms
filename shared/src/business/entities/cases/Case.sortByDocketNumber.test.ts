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
  it('should return the cases sorted properly, with a consolidated case appearing after its lead case', () => {
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

  it('should return the cases sorted properly, when cases contains a consolidated grouping and the lead case is missing', () => {
    const cases = Case.sortByDocketNumberAndGroupConsolidatedCases([
      {
        docketNumber: '102-20',
        leadDocketNumber: '101-20',
      },
      {
        docketNumber: '104-20',
        leadDocketNumber: '101-20',
      },
      {
        docketNumber: '103-20',
      },
      {
        docketNumber: '110-19',
      },
    ]);

    expect(cases).toEqual([
      expect.objectContaining({
        docketNumber: '110-19',
      }),
      expect.objectContaining({
        docketNumber: '102-20',
      }),
      expect.objectContaining({
        docketNumber: '103-20',
      }),
      expect.objectContaining({
        docketNumber: '104-20',
      }),
    ]);
  });

  it('should return the cases sorted properly, with multiple consolidated cases appearing (in sorted order) after their lead cases', () => {
    const cases = Case.sortByDocketNumberAndGroupConsolidatedCases([
      {
        docketNumber: '101-20',
        leadDocketNumber: '101-20',
      },
      {
        docketNumber: '104-20',
        leadDocketNumber: '101-20',
      },
      {
        docketNumber: '102-20',
        leadDocketNumber: '101-20',
      },
      {
        docketNumber: '103-20',
      },
      {
        docketNumber: '110-19',
      },
    ]);

    expect(cases).toEqual([
      expect.objectContaining({
        docketNumber: '110-19',
      }),
      expect.objectContaining({
        docketNumber: '101-20',
      }),
      expect.objectContaining({
        docketNumber: '102-20',
      }),
      expect.objectContaining({
        docketNumber: '104-20',
      }),
      expect.objectContaining({
        docketNumber: '103-20',
      }),
    ]);
  });
});
