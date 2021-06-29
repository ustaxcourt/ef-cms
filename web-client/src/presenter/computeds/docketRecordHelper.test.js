import { CASE_STATUS_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { docketRecordHelper } from './docketRecordHelper';
import { runCompute } from 'cerebral/test';

describe('docket record helper', () => {
  it('should show links for editing docket entries if user does have EDIT_DOCKET_ENTRY permission', () => {
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

  it('should show printable docket record button if the case status is not new', () => {
    const result = runCompute(docketRecordHelper, {
      state: {
        caseDetail: {
          status: CASE_STATUS_TYPES.calendared,
        },
        form: {},
        permissions: {
          EDIT_DOCKET_ENTRY: true,
        },
      },
    });
    expect(result.showPrintableDocketRecord).toBeTruthy();
  });

  it('should not show printable docket record button if the case status is new', () => {
    const result = runCompute(docketRecordHelper, {
      state: {
        caseDetail: {
          status: CASE_STATUS_TYPES.new,
        },
        form: {},
        permissions: {
          EDIT_DOCKET_ENTRY: true,
        },
      },
    });
    expect(result.showPrintableDocketRecord).toBeFalsy();
  });
});
