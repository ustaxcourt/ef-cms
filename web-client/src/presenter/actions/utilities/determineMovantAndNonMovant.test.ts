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

  describe('when a filing party name contains a petitioner name', () => {
    it('names the other filing party, not the petitioner, when only the other filing party filed', () => {
      const result = determineMovantAndNonMovant({
        caseDetail: {
          petitioners: [{ contactId: 'petitioner-1', name: 'John Doe' }],
        },
        motion: {
          filedBy: 'John Doe Foundation',
          filers: [],
          otherFilingParty: 'John Doe Foundation',
        },
      });
      expect(result).toEqual({
        movant: 'John Doe Foundation',
        nonMovant: 'the parties',
      });
    });

    it('names the petitioner when the petitioner filed alongside the other filing party', () => {
      const result = determineMovantAndNonMovant({
        caseDetail: {
          petitioners: [{ contactId: 'petitioner-1', name: 'John Doe' }],
        },
        motion: {
          filedBy: 'Petr. John Doe, John Doe Foundation',
          filers: ['petitioner-1'],
          otherFilingParty: 'John Doe Foundation',
        },
      });
      expect(result).toEqual({ movant: 'petitioner', nonMovant: 'respondent' });
    });

    it('does not treat the petitioner as the filer when filedBy only names a party whose name contains theirs', () => {
      const result = determineMovantAndNonMovant({
        caseDetail: { petitioners: [{ name: 'John Doe' }] },
        motion: { filedBy: 'John Doe Foundation' },
      });
      expect(result).toEqual({ movant: 'respondent', nonMovant: 'petitioner' });
    });

    it('does not treat the petitioner as the filer when their name ends another party name', () => {
      const result = determineMovantAndNonMovant({
        caseDetail: { petitioners: [{ name: 'Doe Foundation' }] },
        motion: { filedBy: 'John Doe Foundation' },
      });
      expect(result).toEqual({ movant: 'respondent', nonMovant: 'petitioner' });
    });
  });

  it('identifies a petitioner whose own name contains commas', () => {
    const result = determineMovantAndNonMovant({
      caseDetail: {
        petitioners: [
          { name: 'Estate of John Doe, Deceased, Jane Doe, Executrix' },
        ],
      },
      motion: {
        filedBy: 'Petr. Estate of John Doe, Deceased, Jane Doe, Executrix',
      },
    });
    expect(result).toEqual({ movant: 'petitioner', nonMovant: 'respondent' });
  });

  it('ignores petitioners that have no name', () => {
    const result = determineMovantAndNonMovant({
      caseDetail: { petitioners: [{ name: '' }] },
      motion: { filedBy: 'Respt. Commissioner' },
    });
    expect(result).toEqual({ movant: 'respondent', nonMovant: 'petitioner' });
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
