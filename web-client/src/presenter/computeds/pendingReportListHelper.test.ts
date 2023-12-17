import { applicationContext } from '../../applicationContext';
import { pendingReportListHelper } from './pendingReportListHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('pendingReportListHelper', () => {
  const pendingReportList = withAppContextDecorator(
    pendingReportListHelper,
    applicationContext,
  );

  it('should display load more button if more results are to be loaded', () => {
    const mockState = {
      pendingReports: {
        hasPendingItemsResults: true,
        pendingItems: [],
        pendingItemsPage: 0,
        pendingItemsTotal: 1000,
        selectedJudge: 'Buch',
      },
    };

    const { showLoadMore } = runCompute(pendingReportList, {
      state: mockState,
    });
    expect(showLoadMore).toBe(true);
  });

  it('should hide the load more button if more results are to be loaded', () => {
    const mockState = {
      pendingReports: {
        hasPendingItemsResults: true,
        pendingItems: [{}],
        pendingItemsPage: 0,
        pendingItemsTotal: 1,
        selectedJudge: 'Buch',
      },
    };

    const { showLoadMore } = runCompute(pendingReportList, {
      state: mockState,
    });
    expect(showLoadMore).toBe(false);
  });

  it('should set showNoPendingItems to false when a judge is selected but no results come back', () => {
    const mockState = {
      pendingReports: {
        hasPendingItemsResults: false,
        pendingItems: [{}],
        pendingItemsPage: 0,
        pendingItemsTotal: 0,
        selectedJudge: 'Buch',
      },
    };

    const { showNoPendingItems } = runCompute(pendingReportList, {
      state: mockState,
    });
    expect(showNoPendingItems).toBe(true);
  });

  it('should set showNoPendingItems to false when results come back and a judge is selected', () => {
    const mockState = {
      pendingReports: {
        hasPendingItemsResults: true,
        pendingItems: [{}],
        pendingItemsPage: 0,
        pendingItemsTotal: 1,
        selectedJudge: 'Buch',
      },
    };

    const { showNoPendingItems } = runCompute(pendingReportList, {
      state: mockState,
    });
    expect(showNoPendingItems).toBe(false);
  });

  it('should set showSelectJudgeText to true when no judge selected', () => {
    const mockState = {
      pendingReports: {
        hasPendingItemsResults: true,
        pendingItems: [{}],
        pendingItemsPage: 0,
        pendingItemsTotal: 1,
        selectedJudge: undefined,
      },
    };

    const { showSelectJudgeText } = runCompute(pendingReportList, {
      state: mockState,
    });
    expect(showSelectJudgeText).toBe(true);
  });

  it('should set showSelectJudgeText to false when a judge is selected', () => {
    const mockState = {
      pendingReports: {
        hasPendingItemsResults: true,
        pendingItems: [{}],
        pendingItemsPage: 0,
        pendingItemsTotal: 1,
        selectedJudge: 'Buch',
      },
    };

    const { showSelectJudgeText } = runCompute(pendingReportList, {
      state: mockState,
    });
    expect(showSelectJudgeText).toBe(false);
  });
});
