import { cloneDeep } from 'lodash';
import { initialPendingReportsState } from '@web-client/presenter/state/pendingReportState';
import { pendingReportHelper as pendingReportComputed } from './pendingReportHelper';
import { runCompute } from '@web-client/presenter/test.cerebral';
import { withAppContextDecorator } from '../../withAppContext';
import { STATE_KEYS } from '@shared/business/entities/EntityConstants';

describe('pendingReportHelper', () => {
  const pendingReportHelper = withAppContextDecorator(pendingReportComputed);

  const pendingReportsState = cloneDeep(initialPendingReportsState);

  it('appends screenMetadata.pendingItemsFilters.judge on the printUrl if one is present', () => {
    const result = runCompute(pendingReportHelper, {
      state: {
        [STATE_KEYS.PENDING_REPORT_TABLE_SORT]: {},
        judges: [],
        pendingReports: pendingReportsState,
        screenMetadata: {
          pendingItemsFilters: {
            judge: 'Judge Somebody',
          },
        },
      },
    });

    expect(result.printUrl).toContain('Judge%20Somebody');
  });

  it('returns default printUrl if screenMetadata.pendingItemsFilters.judge is not set', () => {
    const result = runCompute(pendingReportHelper, {
      state: {
        [STATE_KEYS.PENDING_REPORT_TABLE_SORT]: {},
        judges: [],
        pendingReports: pendingReportsState,
        screenMetadata: { pendingItemsFilters: {} },
      },
    });

    expect(result.printUrl).toEqual('/reports/pending-report/printable?');
  });
});
