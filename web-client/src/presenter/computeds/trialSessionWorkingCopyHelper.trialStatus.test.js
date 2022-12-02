import { MOCK_CASE } from '../../../../shared/src/test/mockCase';
import { TRIAL_STATUS_TYPES } from '../../../../shared/src/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { runCompute } from 'cerebral/test';
import { trialSessionWorkingCopyHelper as trialSessionWorkingCopyHelperComputed } from './trialSessionWorkingCopyHelper';
import { withAppContextDecorator } from '../../withAppContext';

describe('trial session working copy computed', () => {
  const trialSessionWorkingCopyHelper = withAppContextDecorator(
    trialSessionWorkingCopyHelperComputed,
    applicationContext,
  );

  const MOCK_TRIAL_SESSION = {
    city: 'Hartford',
    courtReporter: 'Test Court Reporter',
    irsCalendarAdministrator: 'Test Calendar Admin',
    judge: { name: 'Test Judge' },
    postalCode: '12345',
    startDate: '2019-11-25T15:00:00.000Z',
    startTime: '10:00',
    state: 'TX',
    term: 'Fall',
    termYear: '2019',
    trialClerk: { name: 'Test Trial Clerk' },
    trialLocation: 'Houston, Texas',
  };

  describe('trialStatus', () => {
    it('should omit new trial status types when UPDATED_TRIAL_STATUS_TYPES feature fg is inactive', () => {
      const { trialStatusOptions } = runCompute(trialSessionWorkingCopyHelper, {
        state: {
          featureFlags: {
            'updated-trial-status-types': false,
          },
          trialSession: {
            ...MOCK_TRIAL_SESSION,
            calendaredCases: [MOCK_CASE],
            caseOrder: [],
          },
          trialSessionWorkingCopy: {
            caseMetadata: {},
            filters: { statusUnassigned: true },
            sort: 'docket',
            sortOrder: 'asc',
            userNotes: {},
          },
        },
      });

      expect(trialStatusOptions).toMatchObject({
        basisReached: {},
        continued: {},
        dismissed: {},
        recall: {},
        rule122: {},
        setForTrial: {},
        settled: {},
        submittedCAV: {},
      });
    });
  });

  it('should return all status types when UPDATED_TRIAL_STATUS_TYPES feature flag is active', () => {
    const { trialStatusOptions } = runCompute(trialSessionWorkingCopyHelper, {
      state: {
        featureFlags: {
          'updated-trial-status-types': true,
        },
        trialSession: {
          ...MOCK_TRIAL_SESSION,
          calendaredCases: [MOCK_CASE],
          caseOrder: [],
        },
        trialSessionWorkingCopy: {
          caseMetadata: {},
          filters: { statusUnassigned: true },
          sort: 'docket',
          sortOrder: 'asc',
          userNotes: {},
        },
      },
    });

    expect(trialStatusOptions).toEqual(TRIAL_STATUS_TYPES);
  });

  it('should omit deprecated trial status types and sort trialStatusFilters by displayOrder when UPDATED_TRIAL_STATUS_TYPES feature flag is active', () => {
    const { trialStatusFilters } = runCompute(trialSessionWorkingCopyHelper, {
      state: {
        featureFlags: {
          'updated-trial-status-types': true,
        },
        trialSession: {
          ...MOCK_TRIAL_SESSION,
          calendaredCases: [MOCK_CASE],
          caseOrder: [],
        },
        trialSessionWorkingCopy: {
          caseMetadata: {},
          filters: { statusUnassigned: true },
          sort: 'docket',
          sortOrder: 'asc',
          userNotes: {},
        },
      },
    });

    expect(trialStatusFilters).toMatchObject([
      {
        key: 'basisReached',
        label: 'Basis Reached',
      },
      {
        key: 'recall',
        label: 'Recall',
      },
      {
        key: 'probableSettlement',
        label: 'Probable Settlement',
      },
      { key: 'continued', label: 'Continued' },
      {
        key: 'probableTrial',
        label: 'Probable Trial',
      },
      {
        key: 'rule122',
        label: 'Rule 122',
      },
      {
        key: 'definiteTrial',
        label: 'Definite Trial',
      },
      {
        key: 'submittedCAV',
        label: 'Submitted/CAV',
      },
      {
        key: 'motionToDismiss',
        label: 'Motion',
      },
      {
        key: 'statusUnassigned',
        label: 'Unassigned',
      },
    ]);
  });

  it('should omit new trial status types instead of deprecated, not sort trialStatusFilters by displayOrder, and return legacyLabel when it exists when UPDATED_TRIAL_STATUS_TYPES feature flag is active', () => {
    const { trialStatusFilters } = runCompute(trialSessionWorkingCopyHelper, {
      state: {
        featureFlags: {
          'updated-trial-status-types': false,
        },
        trialSession: {
          ...MOCK_TRIAL_SESSION,
          calendaredCases: [MOCK_CASE],
          caseOrder: [],
        },
        trialSessionWorkingCopy: {
          caseMetadata: {},
          filters: { statusUnassigned: true },
          sort: 'docket',
          sortOrder: 'asc',
          userNotes: {},
        },
      },
    });

    expect(trialStatusFilters).toMatchObject([
      {
        key: 'setForTrial',
        label: 'Set for Trial',
      },
      {
        key: 'dismissed',
        label: 'Dismissed',
      },
      { key: 'continued', label: 'Continued' },
      {
        key: 'rule122',
        label: 'Rule 122',
      },
      {
        key: 'basisReached',
        label: 'A Basis Reached',
      },
      {
        key: 'settled',
        label: 'Settled',
      },
      {
        key: 'recall',
        label: 'Recall',
      },
      {
        key: 'submittedCAV',
        label: 'Taken Under Advisement',
      },
      {
        key: 'statusUnassigned',
        label: 'Status unassigned',
      },
    ]);
  });
});
