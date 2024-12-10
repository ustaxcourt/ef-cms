import { CHIEF_JUDGE } from '@shared/business/entities/EntityConstants';
import { applicationContext } from '../../applicationContext';
import { cloneDeep } from 'lodash';
import { initialPendingReportsState } from '../state/pendingReportState';
import { pendingReportListHelper } from './pendingReportListHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('pendingReportListHelper', () => {
  const pendingReportList = withAppContextDecorator(
    pendingReportListHelper,
    applicationContext,
  );

  it('should return showNoPendingItems as false when a judge is selected but no results come back', () => {
    const mockState = {
      judges: [],
      pendingReports: {
        hasPendingItemsResults: false,
        pendingItems: [{}],
        pendingItemsTotal: 0,
        selectedJudge: 'Buch',
      },
    };

    const { showNoPendingItems } = runCompute(pendingReportList, {
      state: mockState,
    });
    expect(showNoPendingItems).toBe(true);
  });

  it('should return showNoPendingItems as false when results come back and a judge is selected', () => {
    const mockState = {
      judges: [],
      pendingReports: {
        hasPendingItemsResults: true,
        pendingItems: [{}],
        pendingItemsTotal: 1,
        selectedJudge: 'Buch',
      },
    };

    const { showNoPendingItems } = runCompute(pendingReportList, {
      state: mockState,
    });
    expect(showNoPendingItems).toBe(false);
  });

  it('should return showSelectJudgeText as true when no judge selected', () => {
    const mockState = {
      judges: [],
      pendingReports: {
        hasPendingItemsResults: true,
        pendingItems: [{}],
        pendingItemsTotal: 1,
        selectedJudge: undefined,
      },
    };

    const { showSelectJudgeText } = runCompute(pendingReportList, {
      state: mockState,
    });
    expect(showSelectJudgeText).toBe(true);
  });

  it('should return showSelectJudgeText as false when a judge is selected', () => {
    const mockState = {
      judges: [],
      pendingReports: {
        hasPendingItemsResults: true,
        pendingItems: [{}],
        pendingItemsTotal: 1,
        selectedJudge: 'Buch',
      },
    };

    const { showSelectJudgeText } = runCompute(pendingReportList, {
      state: mockState,
    });
    expect(showSelectJudgeText).toBe(false);
  });

  it('should return a formatted and sorted list of judges', () => {
    const mockState = {
      judges: [{ name: 'Judge A' }, { name: 'Judge B' }],
      pendingReports: cloneDeep(initialPendingReportsState),
    };

    const { judges } = runCompute(pendingReportList, { state: mockState });

    expect(judges).toEqual(['A', 'B', CHIEF_JUDGE]);
  });
});
