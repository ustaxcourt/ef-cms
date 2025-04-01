import { Case } from './Case';

describe('findLeadCaseForCases', () => {
  it('Should return the case with the lowest docket number for cases filed in the same year', () => {
    const result = Case.findLeadCaseForCases([
      {
        docketNumber: '110-19',
      } as RawCase,
      {
        docketNumber: '100-19',
      } as RawCase,
      {
        docketNumber: '120-19',
      } as RawCase,
    ]);

    expect(result).toBeDefined();
    expect(result!.docketNumber).toEqual('100-19');
  });

  it('Should return the case with the lowest docket number for cases filed in different years', () => {
    const result = Case.findLeadCaseForCases([
      {
        docketNumber: '100-19',
      } as RawCase,
      {
        docketNumber: '110-18',
      } as RawCase,
      {
        docketNumber: '120-19',
      } as RawCase,
    ]);

    expect(result).toBeDefined();
    expect(result!.docketNumber).toEqual('110-18');
  });
});
