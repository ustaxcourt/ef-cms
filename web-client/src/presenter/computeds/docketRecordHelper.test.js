import { docketRecordHelper } from './docketRecordHelper';
import { runCompute } from 'cerebral/test';

describe('docket record helper', () => {
  it('should not show links for editing docket entries if user does have EDIT_DOCKET_ENTRY permission', () => {
    const result = runCompute(docketRecordHelper, {
      state: {
        caseDetail: {},
        form: {},
        permissions: {
          EDIT_DOCKET_ENTRY: true,
        },
      },
    });
    expect(result.showEditDocketRecordEntry).toBeTruthy();
  });
  it('should not show links for editing docket entries if user does not have EDIT_DOCKET_ENTRY permission', () => {
    const result = runCompute(docketRecordHelper, {
      state: {
        caseDetail: {},
        form: {},
        permissions: {
          EDIT_DOCKET_ENTRY: false,
        },
      },
    });
    expect(result.showEditDocketRecordEntry).toBeFalsy();
  });
});
