const { Case } = require('./Case');

describe('sortByDocketNumber', () => {
  it('Should return the cases as an array sorted by docket number for cases filed in the same year', () => {
    const result = Case.sortByDocketNumber([
      {
        docketNumber: '110-19',
      },
      {
        docketNumber: '100-19',
      },
      {
        docketNumber: '120-19',
      },
    ]);

    expect(result).toEqual([
      {
        docketNumber: '100-19',
      },
      {
        docketNumber: '110-19',
      },
      {
        docketNumber: '120-19',
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
        docketNumber: '120-18',
      },
    ]);

    expect(result).toEqual([
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
