import { CASE_STATUS_TYPES, PAYMENT_STATUS } from '../entities/EntityConstants';
import { MOCK_CASE } from '../../test/mockCase';
import {
  formatHearings,
  getBlockedInfo,
  getConsolidationInfo,
  getFilingFeeInfo,
  getTrialSessionFields,
} from './getFormattedCaseDetail';

const BASE_CASE: RawCase = {
  ...MOCK_CASE,
  correspondence: [],
  docketEntries: [],
};

describe('getFilingFeeInfo', () => {
  it('should return formatted payment date and method when payment status is Paid', () => {
    const result = getFilingFeeInfo({
      ...BASE_CASE,
      petitionPaymentDate: '2020-03-01T21:00:00.000Z',
      petitionPaymentMethod: 'check',
      petitionPaymentStatus: PAYMENT_STATUS.PAID,
    } as RawCase);

    expect(result.paymentDate).toEqual('03/01/20');
    expect(result.paymentMethod).toEqual('check');
    expect(result.filingFee).toEqual(`${PAYMENT_STATUS.PAID} 03/01/20 check`);
  });

  it('should return formatted waived date and empty method when payment status is Waived', () => {
    const result = getFilingFeeInfo({
      ...BASE_CASE,
      petitionPaymentStatus: PAYMENT_STATUS.WAIVED,
      petitionPaymentWaivedDate: '2020-05-01T21:00:00.000Z',
    } as RawCase);

    expect(result.paymentDate).toEqual('05/01/20');
    expect(result.paymentMethod).toEqual('');
    expect(result.filingFee).toEqual(`${PAYMENT_STATUS.WAIVED} 05/01/20 `);
  });

  it('should return empty payment date and method when payment status is Not Paid', () => {
    const result = getFilingFeeInfo({
      ...BASE_CASE,
      petitionPaymentStatus: PAYMENT_STATUS.UNPAID,
    } as RawCase);

    expect(result.paymentDate).toEqual('');
    expect(result.paymentMethod).toEqual('');
    expect(result.filingFee).toEqual(`${PAYMENT_STATUS.UNPAID}  `);
  });

  it('should default paymentMethod to empty string when Paid but no method is provided', () => {
    const result = getFilingFeeInfo({
      ...BASE_CASE,
      petitionPaymentDate: '2020-03-01T21:00:00.000Z',
      petitionPaymentMethod: undefined,
      petitionPaymentStatus: PAYMENT_STATUS.PAID,
    } as unknown as RawCase);

    expect(result.paymentMethod).toEqual('');
  });
});

describe('getConsolidationInfo', () => {
  it('should identify a lead case', () => {
    const result = getConsolidationInfo({
      ...BASE_CASE,
      docketNumber: '101-18',
      leadDocketNumber: '101-18',
    } as RawCase);

    expect(result.caseIsLeadCase).toBe(true);
    expect(result.isConsolidatedSubCase).toBe(false);
    expect(result.inConsolidatedGroup).toBe(true);
    expect(result.consolidatedIconTooltipText).toEqual('Lead case');
  });

  it('should identify a consolidated sub case', () => {
    const result = getConsolidationInfo({
      ...BASE_CASE,
      docketNumber: '101-18',
      leadDocketNumber: '999-18',
    } as RawCase);

    expect(result.caseIsLeadCase).toBe(false);
    expect(result.isConsolidatedSubCase).toBe(true);
    expect(result.inConsolidatedGroup).toBe(true);
    expect(result.consolidatedIconTooltipText).toEqual('Consolidated case');
  });

  it('should identify a case not in a consolidated group', () => {
    const result = getConsolidationInfo({
      ...BASE_CASE,
      docketNumber: '101-18',
      leadDocketNumber: undefined,
    } as RawCase);

    expect(result.caseIsLeadCase).toBe(false);
    expect(result.isConsolidatedSubCase).toBe(false);
    expect(result.inConsolidatedGroup).toBe(false);
    expect(result.consolidatedIconTooltipText).toEqual('');
  });
});

describe('getBlockedInfo', () => {
  it('should return blocked info when case is blocked and not calendared', () => {
    const result = getBlockedInfo({
      ...BASE_CASE,
      blocked: true,
      blockedDate: '2020-03-01T21:00:00.000Z',
      status: CASE_STATUS_TYPES.new,
    } as RawCase);

    expect(result.blocked).toBe(true);
    expect(result.showBlockedFromTrial).toBe(true);
    expect(result.showNotScheduled).toBe(false);
    expect(result.blockedDateFormatted).toEqual('03/01/20');
  });

  it('should not show blocked from trial when case is calendared', () => {
    const result = getBlockedInfo({
      ...BASE_CASE,
      blocked: true,
      blockedDate: '2020-03-01T21:00:00.000Z',
      status: CASE_STATUS_TYPES.calendared,
    } as RawCase);

    expect(result.blocked).toBe(true);
    expect(result.showBlockedFromTrial).toBe(false);
  });

  it('should return not blocked info when case is not blocked', () => {
    const result = getBlockedInfo({
      ...BASE_CASE,
      blocked: false,
      status: CASE_STATUS_TYPES.new,
    } as RawCase);

    expect(result.blocked).toBe(false);
    expect(result.showBlockedFromTrial).toBe(false);
    expect(result.showNotScheduled).toBe(true);
    expect(result.blockedDateFormatted).toEqual('');
  });

  it('should return showNotScheduled as false when case has a trial session', () => {
    const result = getBlockedInfo({
      ...BASE_CASE,
      blocked: false,
      status: CASE_STATUS_TYPES.new,
      trialSessionId: 'some-trial-session-id',
    } as RawCase);

    expect(result.showNotScheduled).toBe(false);
  });

  it('should return showNotScheduled as false when case is blocked', () => {
    const result = getBlockedInfo({
      ...BASE_CASE,
      blocked: true,
      blockedDate: '2020-03-01T21:00:00.000Z',
      status: CASE_STATUS_TYPES.new,
    } as RawCase);

    expect(result.showNotScheduled).toBe(false);
  });
});

describe('getTrialSessionFields', () => {
  it('should return defaults when there is no trial session', () => {
    const result = getTrialSessionFields({
      ...BASE_CASE,
      trialSessionId: undefined,
    } as RawCase);

    expect(result.formattedTrialCity).toEqual('Not assigned');
    expect(result.formattedTrialDate).toEqual('Not scheduled');
    expect(result.formattedAssociatedJudge).toEqual('');
    expect(result.showScheduled).toBe(false);
    expect(result.showTrialCalendared).toBe(false);
    expect(result.trialLocation).toEqual('');
    expect(result.trialTime).toEqual('');
  });

  it('should return trial location when trial session exists with location', () => {
    const result = getTrialSessionFields({
      ...BASE_CASE,
      associatedJudge: 'Judge Fieri',
      status: CASE_STATUS_TYPES.calendared,
      trialDate: '2020-03-01T21:00:00.000Z',
      trialLocation: 'Washington, District of Columbia',
      trialSessionId: 'some-trial-session-id',
      trialTime: '10:00',
    } as RawCase);

    expect(result.formattedTrialCity).toEqual(
      'Washington, District of Columbia',
    );
    expect(result.formattedTrialDate).not.toEqual('Not scheduled');
    expect(result.formattedAssociatedJudge).toEqual('Judge Fieri');
    expect(result.showTrialCalendared).toBe(true);
    expect(result.showScheduled).toBe(false);
    expect(result.trialLocation).toEqual('Washington, District of Columbia');
    expect(result.trialTime).toEqual('10:00');
  });

  it('should return "Not assigned" for formattedTrialCity when trial session exists without location', () => {
    const result = getTrialSessionFields({
      ...BASE_CASE,
      status: CASE_STATUS_TYPES.calendared,
      trialDate: '2020-03-01T21:00:00.000Z',
      trialLocation: undefined,
      trialSessionId: 'some-trial-session-id',
    } as RawCase);

    expect(result.formattedTrialCity).toEqual('Not assigned');
    expect(result.trialLocation).toEqual('');
  });

  it('should format trial date without time when trialTime is not provided', () => {
    const result = getTrialSessionFields({
      ...BASE_CASE,
      status: CASE_STATUS_TYPES.new,
      trialDate: '2020-03-01T21:00:00.000Z',
      trialSessionId: 'some-trial-session-id',
      trialTime: undefined,
    } as RawCase);

    expect(result.formattedTrialDate).toEqual('03/01/20');
    expect(result.trialTime).toEqual('');
  });

  it('should format trial date with time when trialTime is provided', () => {
    const result = getTrialSessionFields({
      ...BASE_CASE,
      status: CASE_STATUS_TYPES.new,
      trialDate: '2020-03-01T21:00:00.000Z',
      trialSessionId: 'some-trial-session-id',
      trialTime: '10:00',
    } as RawCase);

    expect(result.formattedTrialDate).not.toEqual('Not scheduled');
    expect(result.formattedTrialDate).not.toEqual('03/01/20');
  });

  it('should return showScheduled true when trial session exists and case is not calendared', () => {
    const result = getTrialSessionFields({
      ...BASE_CASE,
      status: CASE_STATUS_TYPES.new,
      trialSessionId: 'some-trial-session-id',
    } as RawCase);

    expect(result.showScheduled).toBe(true);
    expect(result.showTrialCalendared).toBe(false);
  });

  it('should return "Not assigned" for formattedAssociatedJudge when trial session exists but no judge', () => {
    const result = getTrialSessionFields({
      ...BASE_CASE,
      associatedJudge: undefined,
      status: CASE_STATUS_TYPES.new,
      trialSessionId: 'some-trial-session-id',
    } as RawCase);

    expect(result.formattedAssociatedJudge).toEqual('Not assigned');
  });

  it('should return "Not scheduled" when trial session exists but no trial date', () => {
    const result = getTrialSessionFields({
      ...BASE_CASE,
      trialDate: undefined,
      trialSessionId: 'some-trial-session-id',
    } as RawCase);

    expect(result.formattedTrialDate).toEqual('Not scheduled');
  });
});

describe('formatHearings', () => {
  it('should format hearings when they exist', () => {
    const caseData = {
      ...BASE_CASE,
      hearings: [
        {
          judge: { name: 'Judge Fieri' },
          startDate: '2020-03-01T21:00:00.000Z',
          startTime: '10:00',
          trialLocation: 'Washington, District of Columbia',
        },
      ],
    } as unknown as RawCase;

    formatHearings(caseData);

    expect(caseData.hearings![0]).toHaveProperty('formattedTrialCity');
    expect(caseData.hearings![0]).toHaveProperty('formattedAssociatedJudge');
  });

  it('should not throw when hearings is undefined', () => {
    const caseData = {
      ...BASE_CASE,
      hearings: undefined,
    } as unknown as RawCase;

    expect(() => formatHearings(caseData)).not.toThrow();
  });

  it('should not throw when hearings is an empty array', () => {
    const caseData = {
      ...BASE_CASE,
      hearings: [],
    } as unknown as RawCase;

    expect(() => formatHearings(caseData)).not.toThrow();
  });

  it('should format hearings when judge is null', () => {
    const caseData = {
      ...BASE_CASE,
      hearings: [
        {
          judge: null,
          startDate: '2020-03-01T21:00:00.000Z',
          startTime: '10:00',
          trialLocation: 'Washington, District of Columbia',
        },
      ],
    } as unknown as RawCase;

    formatHearings(caseData);

    expect(caseData.hearings![0]).toHaveProperty('formattedTrialCity');
  });
});
