import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { runAction } from '@web-client/presenter/test.cerebral';
import { setBlockedCaseReportProcedureTypeAction } from '@web-client/presenter/actions/Reports/BlockedCaseReport/setBlockedCaseReportProcedureTypeAction';

describe('setBlockedCaseReportProcedureTypeAction', () => {
  it('should reset the blocked cases report filters for case status and reason to "All" when a new procedure type is selected', async () => {
    const { state } = await runAction(setBlockedCaseReportProcedureTypeAction, {
      props: { procedureType: 'Regular' },
      state: {
        blockedCaseReportFilter: {
          caseStatusFilter: CASE_STATUS_TYPES.generalDocket,
          procedureTypeFilter: 'Small',
          reasonFilter: 'Due Date',
        },
      },
    });

    expect(state.blockedCaseReportFilter).toEqual({
      caseStatusFilter: 'All',
      procedureTypeFilter: 'Regular',
      reasonFilter: 'All',
    });
  });
});
