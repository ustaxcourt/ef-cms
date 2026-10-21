import { getConsolidatedCasesWording } from './getConsolidatedCasesWording';

describe('getConsolidatedCasesWording', () => {
  it('returns singular wording when the order applies to a single case', () => {
    expect(getConsolidatedCasesWording(false)).toEqual({
      calendaredPreamble: 'This case is',
      orderedSubject: 'this case is',
    });
  });

  it('returns plural wording when the order applies to all cases in a consolidated group', () => {
    expect(getConsolidatedCasesWording(true)).toEqual({
      calendaredPreamble: 'These consolidated cases are',
      orderedSubject: 'these cases are',
    });
  });
});
