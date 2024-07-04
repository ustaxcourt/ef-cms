import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { statusReportOrderResponseHelper as statusReportOrderResponseHelperComputed } from './statusReportOrderResponseHelper';
import { withAppContextDecorator } from '../../withAppContext';

const statusReportOrderResponseHelper = withAppContextDecorator(
  statusReportOrderResponseHelperComputed,
  applicationContext,
);
const today = formatNow(FORMATS.YYYYMMDD);
const isLeadCase = false;
const docketNumber = '107-19';
const leadDocketNumber = '108-20';

describe('status report order response helper', () => {
  it('should be lead case and have min date today or later when docket number and lead docket number match', () => {
    const result = runCompute(statusReportOrderResponseHelper, {
      state: {
        caseDetail: {
          docketNumber,
          leadDocketNumber: docketNumber,
        },
        validationErrors: {},
      },
    });
    expect(result).toEqual({
      dueDateErrorText: undefined,
      isLeadCase: true,
      jurisdictionErrorText: undefined,
      minDate: today,
    });
  });

  it('should not be lead case and have min date today or later when docket number and lead docket number do not match', () => {
    const result = runCompute(statusReportOrderResponseHelper, {
      state: {
        caseDetail: {
          docketNumber,
          leadDocketNumber,
        },
        validationErrors: {},
      },
    });
    expect(result).toEqual({
      dueDateErrorText: undefined,
      isLeadCase,
      jurisdictionErrorText: undefined,
      minDate: today,
    });
  });

  it('should show "Select due date" and "Select jurisdiction" when validation errors are present for stipulated decision', () => {
    const result = runCompute(statusReportOrderResponseHelper, {
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
      dueDateErrorText: 'Select due date',
      isLeadCase,
      jurisdictionErrorText: 'Select jurisdiction',
      minDate: today,
    });
  });

  it('should pass through error message for due date when validation errors are present and it is not a stipulated decision', () => {
    const result = runCompute(statusReportOrderResponseHelper, {
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
      dueDateErrorText: 'an error occurred',
      isLeadCase,
      jurisdictionErrorText: undefined,
      minDate: today,
    });
  });
});
