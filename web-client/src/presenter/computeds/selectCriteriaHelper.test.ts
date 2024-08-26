import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { runCompute } from '../test.cerebral';
import { selectCriteriaHelperInternal } from '@web-client/presenter/computeds/selectCriteriaHelper';
import { withAppContextDecorator } from '@web-client/withAppContext';

describe('selectCriteriaHelper', () => {
  const selectCriteriaHelper = withAppContextDecorator(
    selectCriteriaHelperInternal,
    applicationContext,
  );

  describe('Case Statuses', () => {
    it('should return an empty arrayif there are no case in state', () => {
      const { caseStatuses } = runCompute<{ caseStatuses: any }>(
        selectCriteriaHelper,
        {
          state: {
            blockedCases: [],
          },
        },
      );

      expect(caseStatuses).toEqual([]);
    });

    it('should return the case statuses', () => {
      const EXPECTED_OPTIONS = [
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
      ];

      const { caseStatuses } = runCompute<{ caseStatuses: any }>(
        selectCriteriaHelper,
        {
          state: {
            blockedCases: EXPECTED_OPTIONS.map(o => ({ status: o.value })),
          },
        },
      );

      expect(caseStatuses).toEqual(EXPECTED_OPTIONS);
    });
  });

  describe('Blocked Reasons', () => {
    it('should return an empty array of automatic blocked reasons if there are no blocked cases', () => {
      const { automaticBlockedReasons } = runCompute<{
        automaticBlockedReasons: any;
      }>(selectCriteriaHelper, {
        state: {
          blockedCases: [],
        },
      });

      expect(automaticBlockedReasons).toEqual([]);
    });

    it('should return all automatic blocked reasons if there is a blocked cases for each option', () => {
      const { automaticBlockedReasons } = runCompute<{
        automaticBlockedReasons: any;
      }>(selectCriteriaHelper, {
        state: {
          blockedCases: [
            { automaticBlockedReason: 'Due Date' },
            { automaticBlockedReason: 'Pending Item and Due Date' },
            { automaticBlockedReason: 'Pending Item' },
            { blockedReason: 'ANYTHING' },
          ],
        },
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
});
