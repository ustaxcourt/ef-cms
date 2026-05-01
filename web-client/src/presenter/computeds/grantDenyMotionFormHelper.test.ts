import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { FORMATS, formatNow } from '@shared/business/utilities/DateHandler';
import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { grantDenyMotionFormHelper as grantDenyMotionFormHelperComputed } from './grantDenyMotionFormHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

const grantDenyMotionFormHelper = withAppContextDecorator(
  grantDenyMotionFormHelperComputed,
  applicationContext,
);

const today = formatNow(FORMATS.YYYYMMDD);

describe('grantDenyMotionFormHelper', () => {
  it('reports isLeadCase=true when docketNumber matches leadDocketNumber', () => {
    const result = runCompute(grantDenyMotionFormHelper, {
      state: {
        caseDetail: { docketNumber: '101-26', leadDocketNumber: '101-26' },
        form: {},
        validationErrors: {},
      },
    });
    expect(result.isLeadCase).toBe(true);
  });

  it('reports isLeadCase=false when not on a lead case', () => {
    const result = runCompute(grantDenyMotionFormHelper, {
      state: {
        caseDetail: { docketNumber: '101-26' },
        form: {},
        validationErrors: {},
      },
    });
    expect(result.isLeadCase).toBe(false);
  });

  it('reports isCalendared=true when case status is calendared', () => {
    const result = runCompute(grantDenyMotionFormHelper, {
      state: {
        caseDetail: { status: CASE_STATUS_TYPES.calendared },
        form: {},
        validationErrors: {},
      },
    });
    expect(result.isCalendared).toBe(true);
  });

  it('reports showStatusReportFields=true when dueDateMessage is set on the form', () => {
    const result = runCompute(grantDenyMotionFormHelper, {
      state: {
        caseDetail: {},
        form: { dueDateMessage: 'statusReport' },
        validationErrors: {},
      },
    });
    expect(result.showStatusReportFields).toBe(true);
  });

  it('returns minDate as today', () => {
    const result = runCompute(grantDenyMotionFormHelper, {
      state: {
        caseDetail: {},
        form: {},
        validationErrors: {},
      },
    });
    expect(result.minDate).toEqual(today);
  });

  it('extracts the first additionalOrderText error from an array of errors', () => {
    const result = runCompute(grantDenyMotionFormHelper, {
      state: {
        caseDetail: {},
        form: {},
        validationErrors: {
          additionalOrderText: [undefined, 'Limit is 256 characters per entry.'],
        },
      },
    });
    expect(result.additionalOrderTextErrorText).toEqual(
      'Limit is 256 characters per entry.',
    );
  });
});
