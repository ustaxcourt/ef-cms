import { determineMovantAndNonMovant } from './determineMovantAndNonMovant';

describe('determineMovantAndNonMovant', () => {
  it('returns petitioner as movant when single petitioner filed the motion', () => {
    const result = determineMovantAndNonMovant({
      caseDetail: { petitioners: [{ name: 'Jane Doe' }] },
      motion: { filedBy: 'Petr. Jane Doe' },
    });
    expect(result).toEqual({ movant: 'petitioner', nonMovant: 'respondent' });
  });

  it('returns petitioners (plural) when multiple petitioners filed', () => {
    const result = determineMovantAndNonMovant({
      caseDetail: {
        petitioners: [{ name: 'Jane Doe' }, { name: 'John Doe' }],
      },
      motion: { filedBy: 'Petrs. Jane Doe & John Doe' },
    });
    expect(result).toEqual({ movant: 'petitioners', nonMovant: 'respondent' });
  });

  it('returns respondent as movant when respondent filed', () => {
    const result = determineMovantAndNonMovant({
      caseDetail: { petitioners: [{ name: 'Jane Doe' }] },
      motion: { filedBy: 'Respt.' },
    });
    expect(result).toEqual({ movant: 'respondent', nonMovant: 'petitioner' });
  });

  it('handles undefined filedBy without throwing', () => {
    const result = determineMovantAndNonMovant({
      caseDetail: { petitioners: [{ name: 'Jane Doe' }] },
      motion: {},
    });
    expect(result).toEqual({ movant: 'respondent', nonMovant: 'petitioner' });
  });
});
