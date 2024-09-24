import { resetBlockedCasesFiltersAction } from './resetBlockedCasesFiltersAction';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('resetBlockedCasesFiltersAction', () => {
  it('should reset the block cases report filters to "All"', async () => {
    const { state } = await runAction(resetBlockedCasesFiltersAction, {
      state: {
        blockedCaseReportFilter: {
          caseStatusFilter: undefined,
          procedureTypeFilter: undefined,
          reasonFilter: undefined,
        },
      },
    });

    expect(state.blockedCaseReportFilter).toEqual({
      caseStatusFilter: 'All',
      procedureTypeFilter: 'All',
      reasonFilter: 'All',
    });
  });
});
