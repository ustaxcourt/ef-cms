import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runCompute } from '../test.cerebral';
import { selectCriteriaHelperInternal } from '@web-client/presenter/computeds/selectCriteriaHelper';
import { withAppContextDecorator } from '@web-client/withAppContext';

describe('selectCriteriaHelper', () => {
  const selectCriteriaHelper = withAppContextDecorator(
    selectCriteriaHelperInternal,
    applicationContext,
  );

  it('should return the case statuses', () => {
    const { caseStatuses } = runCompute<{ caseStatuses: any }>(
      selectCriteriaHelper,
      {
        state: {},
      },
    );

    expect(caseStatuses).toEqual([
      {
        key: 'assignedCase',
        value: 'Assigned - Case',
      },
      {
        key: 'assignedMotion',
        value: 'Assigned - Motion',
      },
      {
        key: 'cav',
        value: 'CAV',
      },
      {
        key: 'calendared',
        value: 'Calendared',
      },
      {
        key: 'closed',
        value: 'Closed',
      },
      {
        key: 'closedDismissed',
        value: 'Closed - Dismissed',
      },
      {
        key: 'generalDocketReadyForTrial',
        value: 'General Docket - At Issue (Ready for Trial)',
      },
      {
        key: 'generalDocket',
        value: 'General Docket - Not at Issue',
      },
      {
        key: 'jurisdictionRetained',
        value: 'Jurisdiction Retained',
      },
      {
        key: 'new',
        value: 'New',
      },
      {
        key: 'onAppeal',
        value: 'On Appeal',
      },
      {
        key: 'rule155',
        value: 'Rule 155',
      },
      {
        key: 'submitted',
        value: 'Submitted',
      },
      {
        key: 'submittedRule122',
        value: 'Submitted - Rule 122',
      },
    ]);
  });

  it('should return the automatic blocked reasons', () => {
    const { automaticBlockedReasons } = runCompute<{
      automaticBlockedReasons: any;
    }>(selectCriteriaHelper, {
      state: {},
    });

    expect(automaticBlockedReasons).toEqual([
      {
        key: 'dueDate',
        value: 'Due Date',
      },
      {
        key: 'manualBlock',
        value: 'Manual Block',
      },
      {
        key: 'pending',
        value: 'Pending Item',
      },
      {
        key: 'pendingAndDueDate',
        value: 'Pending Item and Due Date',
      },
    ]);
  });
});
