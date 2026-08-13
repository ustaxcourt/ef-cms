import {
  COURT_ISSUED_EVENT_CODES,
  INTERNAL_DOCUMENTS_ARRAY,
} from '../EntityConstants';

describe('Exhibit in Support (EXS) availability', () => {
  it('should exist in COURT_ISSUED_EVENT_CODES', () => {
    const exsInCourtIssued = COURT_ISSUED_EVENT_CODES.find(
      code => code.eventCode === 'EXS',
    );
    expect(exsInCourtIssued).toBeDefined();
    expect(exsInCourtIssued?.documentType).toEqual('Exhibit in Support');
  });

  it('should exist in INTERNAL_DOCUMENTS_ARRAY', () => {
    const exsInInternal = INTERNAL_DOCUMENTS_ARRAY.find(
      doc => doc.eventCode === 'EXS',
    );
    expect(exsInInternal).toBeDefined();
    expect(exsInInternal?.documentType).toEqual('Exhibit in Support');
  });

  it('should be available in both court-issued and filing-event lists', () => {
    const exsInCourtIssued = COURT_ISSUED_EVENT_CODES.some(
      code => code.eventCode === 'EXS',
    );
    const exsInInternal = INTERNAL_DOCUMENTS_ARRAY.some(
      doc => doc.eventCode === 'EXS',
    );
    expect(exsInCourtIssued && exsInInternal).toBe(true);
  });
});
