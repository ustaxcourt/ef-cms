import { applicationContextForClient as applicationContext } from '@web-client/test/createClientTestApplicationContext';
import { cloneDeep } from 'lodash';
import { formattedPendingItemsHelper as formattedPendingItemsComputed } from './formattedPendingItems';
import { initialPendingReportsState } from '@web-client/presenter/state/pendingReportState';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';

describe('formattedPendingItems', () => {
  const { CHIEF_JUDGE } = applicationContext.getConstants();

  const formattedPendingItems = withAppContextDecorator(
    formattedPendingItemsComputed,
  );

  const pendingReportsState = cloneDeep(initialPendingReportsState);

  it('should return formatted and sorted list of judges', () => {
    const result = runCompute(formattedPendingItems, {
      state: {
        judges: [{ name: 'Judge A' }, { name: 'Judge B' }],
        pendingReports: pendingReportsState,
      },
    });

    expect(result.judges).toEqual(['A', 'B', CHIEF_JUDGE]);
  });

  it('appends screenMetadata.pendingItemsFilters.judge on the printUrl if one is present', () => {
    const result = runCompute(formattedPendingItems, {
      state: {
        judges: [],
        pendingReports: pendingReportsState,
        screenMetadata: { pendingItemsFilters: { judge: 'Judge Somebody' } },
      },
    });

    expect(result.printUrl).toContain('Judge%20Somebody');
  });

  it('returns default printUrl if screenMetadata.pendingItemsFilters.judge is not set', () => {
    const result = runCompute(formattedPendingItems, {
      state: {
        judges: [],
        pendingReports: pendingReportsState,
        screenMetadata: { pendingItemsFilters: {} },
      },
    });

    expect(result.printUrl).toEqual('/reports/pending-report/printable?');
  });
});
