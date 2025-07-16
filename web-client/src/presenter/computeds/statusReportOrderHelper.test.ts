import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { statusReportOrderHelper as statusReportOrderHelperComputed } from './statusReportOrderHelper';
import { withAppContextDecorator } from '../../withAppContext';

const statusReportOrderHelper = withAppContextDecorator(
  statusReportOrderHelperComputed,
  applicationContext,
);
const today = formatNow(FORMATS.YYYYMMDD);
const isLeadCase = false;
const docketNumber = '107-19';
const leadDocketNumber = '108-20';

describe('status report order helper', () => {
  it('should be lead case and have min date today or later when docket number and lead docket number match', () => {
    const result = runCompute(statusReportOrderHelper, {
      state: {
        caseDetail: {
          docketNumber,
          leadDocketNumber: docketNumber,
        },
        validationErrors: {},
      },
    });
    expect(result).toEqual({
      dueDateErrorClass: 'status-report-order-form-group',
      dueDateErrorText: undefined,
      isLeadCase: true,
      jurisdictionErrorClass: 'status-report-order-form-group',
      jurisdictionErrorText: undefined,
      minDate: today,
    });
  });

  it('should not be lead case and have min date today or later when docket number and lead docket number do not match', () => {
    const result = runCompute(statusReportOrderHelper, {
      state: {
        caseDetail: {
          docketNumber,
          leadDocketNumber,
        },
        validationErrors: {},
      },
    });
    expect(result).toEqual({
      dueDateErrorClass: 'status-report-order-form-group',
      dueDateErrorText: undefined,
      isLeadCase,
      jurisdictionErrorClass: 'status-report-order-form-group',
      jurisdictionErrorText: undefined,
      minDate: today,
    });
  });

  it('should show "Select due date" and "Select jurisdiction" when validation errors are present for stipulated decision', () => {
    const result = runCompute(statusReportOrderHelper, {
      state: {
        caseDetail: {
          docketNumber,
          leadDocketNumber,
        },
        validationErrors: {
          dueDate: 'stipulated decision',
          jurisdiction: 'an error occurred',
        },
      },
    });
    expect(result).toEqual({
      dueDateErrorClass: 'status-report-order-form-group-error',
      dueDateErrorText: 'Select due date',
      isLeadCase,
      jurisdictionErrorClass: 'status-report-order-form-group-error',
      jurisdictionErrorText: 'Select jurisdiction',
      minDate: today,
    });
  });

  it('should pass through error message for due date when validation errors are present and it is not a stipulated decision', () => {
    const result = runCompute(statusReportOrderHelper, {
      state: {
        caseDetail: {
          docketNumber,
          leadDocketNumber,
        },
        validationErrors: {
          dueDate: 'an error occurred',
        },
      },
    });
    expect(result).toEqual({
      dueDateErrorClass: 'status-report-order-form-group-error',
      dueDateErrorText: 'an error occurred',
      isLeadCase,
      jurisdictionErrorClass: 'status-report-order-form-group',
      jurisdictionErrorText: undefined,
      minDate: today,
    });
  });
});
