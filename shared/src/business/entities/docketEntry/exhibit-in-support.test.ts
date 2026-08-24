import {
  COURT_ISSUED_EVENT_CODES,
  EXTERNAL_DOCUMENTS_ARRAY,
  INTERNAL_DOCUMENTS_ARRAY,
} from '../EntityConstants';
import { DocketEntry } from '@shared/business/entities/DocketEntry';

describe('Exhibit in Support (EXS) availability', () => {
  it('should exist in INTERNAL_DOCUMENTS_ARRAY so internal users can file it on behalf of a party', () => {
    const exsInInternal = INTERNAL_DOCUMENTS_ARRAY.find(
      doc => doc.eventCode === 'EXS',
    );

    expect(exsInInternal).toBeDefined();
    expect(exsInInternal?.documentType).toEqual('Exhibit in Support');
    expect(exsInInternal?.category).toEqual('Supporting Document');
  });

  it('should exist in EXTERNAL_DOCUMENTS_ARRAY so external filers can file it as a supporting document', () => {
    const exsInExternal = EXTERNAL_DOCUMENTS_ARRAY.find(
      doc => doc.eventCode === 'EXS',
    );

    expect(exsInExternal).toBeDefined();
    expect(exsInExternal?.documentType).toEqual('Exhibit in Support');
    expect(exsInExternal?.category).toEqual('Supporting Document');
  });

  it('should NOT exist in COURT_ISSUED_EVENT_CODES because it is a party filing, not a court-issued document', () => {
    const exsInCourtIssued = COURT_ISSUED_EVENT_CODES.find(
      code => code.eventCode === 'EXS',
    );

    expect(exsInCourtIssued).toBeUndefined();
  });

  it('should not be treated as a court-issued document', () => {
    expect(DocketEntry.isCourtIssued({ eventCode: 'EXS' })).toBe(false);
  });
});
