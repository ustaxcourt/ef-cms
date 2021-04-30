const { Case } = require('./Case');

describe('findLeadCaseForCases', () => {
  it('Should return the case with the lowest docket number for cases filed in the same year', () => {
    const result = Case.findLeadCaseForCases([
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

    expect(result.docketNumber).toEqual('100-19');
  });

  it('Should return the case with the lowest docket number for cases filed in different years', () => {
    const result = Case.findLeadCaseForCases([
      {
        docketNumber: '100-19',
      },
      {
        docketNumber: '110-18',
      },
      {
        docketNumber: '120-19',
      },
    ]);

    expect(result.docketNumber).toEqual('110-18');
  });
});
