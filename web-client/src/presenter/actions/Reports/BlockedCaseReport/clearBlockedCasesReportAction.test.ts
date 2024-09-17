import {
  CASE_STATUS_TYPES,
  PROCEDURE_TYPES_MAP,
} from '@shared/business/entities/EntityConstants';
import { clearBlockedCasesReportAction } from '@web-client/presenter/actions/Reports/BlockedCaseReport/clearBlockedCasesReportAction';
import { initialBlockedCaseReportFilter } from '@web-client/presenter/state/blockedCasesReportState';
import { presenter } from '@web-client/presenter/presenter-mock';
import { runAction } from '@web-client/presenter/test.cerebral';

describe('clearBlockedCasesReportAction', () => {
  it('should reset blocked case filters', async () => {
    const { state } = await runAction(clearBlockedCasesReportAction, {
      modules: {
        presenter,
      },
      props: {},
      state: {
        blockedCaseReportFilter: {
          caseStatusFilter: CASE_STATUS_TYPES.calendared,
          procedureTypeFilter: PROCEDURE_TYPES_MAP.regular,
          reasonFilter: 'All',
          trialLocationFilter: 'Birmingham, Alabama',
        },
        blockedCases: [{}],
      },
    });

    expect(state.blockedCaseReportFilter).toEqual(
      initialBlockedCaseReportFilter,
    );
    expect(state.blockedCases).toEqual([]);
  });
});
