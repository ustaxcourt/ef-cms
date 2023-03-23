import { A_VALID_DOCKET_ENTRY, MOCK_PETITIONERS } from './DocketEntry.test';
import { DocketEntry } from './DocketEntry';
import { applicationContext } from '../test/createTestApplicationContext';

describe('setQCed', () => {
  it('updates the document QC information with user name, id, and date', () => {
    const docketEntry = new DocketEntry(A_VALID_DOCKET_ENTRY, {
      applicationContext,
      petitioners: MOCK_PETITIONERS,
    });
    const user = {
      name: 'Jean Luc',
      userId: '02323349-87fe-4d29-91fe-8dd6916d2fda',
    };

    docketEntry.setQCed(user);

    expect(docketEntry.qcByUserId).toEqual(
      '02323349-87fe-4d29-91fe-8dd6916d2fda',
    );
    expect(docketEntry.qcAt).toBeDefined();
  });
});
