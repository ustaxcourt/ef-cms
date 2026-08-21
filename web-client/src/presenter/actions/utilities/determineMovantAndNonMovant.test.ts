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

  it('returns "the parties" when the motion was filed jointly by a petitioner and respondent', () => {
    const result = determineMovantAndNonMovant({
      caseDetail: {
        petitioners: [{ contactId: 'petitioner-1', name: 'Jane Doe' }],
      },
      motion: {
        filedBy: 'Resp. & Petr. Jane Doe',
        filers: ['petitioner-1'],
        partyIrsPractitioner: true,
      },
    });
    expect(result).toEqual({
      movant: 'the parties',
      nonMovant: 'the parties',
    });
  });

  it('names the other filing party as movant when a non-party filed the motion', () => {
    const result = determineMovantAndNonMovant({
      caseDetail: {
        petitioners: [{ contactId: 'petitioner-1', name: 'Jane Doe' }],
      },
      motion: {
        filedBy: 'A Friend',
        filers: [],
        otherFilingParty: 'A Friend',
      },
    });
    expect(result).toEqual({ movant: 'A Friend', nonMovant: 'the parties' });
  });

  it('trims surrounding whitespace from the other filing party name', () => {
    const result = determineMovantAndNonMovant({
      caseDetail: { petitioners: [{ name: 'Jane Doe' }] },
      motion: { otherFilingParty: '  A Friend  ' },
    });
    expect(result.movant).toEqual('A Friend');
  });

  it('prefers petitioner over the other filing party when both filed', () => {
    const result = determineMovantAndNonMovant({
      caseDetail: {
        petitioners: [{ contactId: 'petitioner-1', name: 'Jane Doe' }],
      },
      motion: {
        filedBy: 'Petr. Jane Doe, A Friend',
        filers: ['petitioner-1'],
        otherFilingParty: 'A Friend',
      },
    });
    expect(result).toEqual({ movant: 'petitioner', nonMovant: 'respondent' });
  });

  it('prefers respondent over the other filing party when both filed', () => {
    const result = determineMovantAndNonMovant({
      caseDetail: { petitioners: [{ name: 'Jane Doe' }] },
      motion: {
        filedBy: 'Resp., A Friend',
        filers: [],
        otherFilingParty: 'A Friend',
        partyIrsPractitioner: true,
      },
    });
    expect(result).toEqual({ movant: 'respondent', nonMovant: 'petitioner' });
  });

  it('prefers multiple petitioners over the other filing party when both filed', () => {
    const result = determineMovantAndNonMovant({
      caseDetail: {
        petitioners: [
          { contactId: 'petitioner-1', name: 'Jane Doe' },
          { contactId: 'petitioner-2', name: 'John Doe' },
        ],
      },
      motion: {
        filedBy: 'Petrs. Jane Doe & John Doe, A Friend',
        filers: ['petitioner-1', 'petitioner-2'],
        otherFilingParty: 'A Friend',
      },
    });
    expect(result).toEqual({ movant: 'petitioners', nonMovant: 'respondent' });
  });

  it('prefers "the parties" over the other filing party when a petitioner and respondent both filed', () => {
    const result = determineMovantAndNonMovant({
      caseDetail: {
        petitioners: [{ contactId: 'petitioner-1', name: 'Jane Doe' }],
      },
      motion: {
        filedBy: 'Resp. & Petr. Jane Doe, A Friend',
        filers: ['petitioner-1'],
        otherFilingParty: 'A Friend',
        partyIrsPractitioner: true,
      },
    });
    expect(result).toEqual({ movant: 'the parties', nonMovant: 'the parties' });
  });

  it('prefers "the parties" over the other filing party when multiple petitioners and respondent both filed', () => {
    const result = determineMovantAndNonMovant({
      caseDetail: {
        petitioners: [
          { contactId: 'petitioner-1', name: 'Jane Doe' },
          { contactId: 'petitioner-2', name: 'John Doe' },
        ],
      },
      motion: {
        filers: ['petitioner-1', 'petitioner-2'],
        otherFilingParty: 'A Friend',
        partyIrsPractitioner: true,
      },
    });
    expect(result).toEqual({ movant: 'the parties', nonMovant: 'the parties' });
  });

  it('identifies a petitioner from filers when filedBy does not name them', () => {
    const result = determineMovantAndNonMovant({
      caseDetail: {
        petitioners: [{ contactId: 'petitioner-1', name: 'Jane Doe' }],
      },
      motion: { filers: ['petitioner-1'] },
    });
    expect(result).toEqual({ movant: 'petitioner', nonMovant: 'respondent' });
  });

  it('does not treat the motion as jointly filed when only respondent is checked', () => {
    const result = determineMovantAndNonMovant({
      caseDetail: {
        petitioners: [{ contactId: 'petitioner-1', name: 'Jane Doe' }],
      },
      motion: {
        filedBy: 'Resp.',
        filers: [],
        partyIrsPractitioner: true,
      },
    });
    expect(result).toEqual({ movant: 'respondent', nonMovant: 'petitioner' });
  });
});
