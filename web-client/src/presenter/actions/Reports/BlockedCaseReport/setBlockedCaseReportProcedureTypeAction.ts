import { state } from '@web-client/presenter/app.cerebral';

export const setBlockedCaseReportProcedureTypeAction = ({
  props,
  store,
}: ActionProps<{ procedureType: string }>) => {
  store.set(
    state.blockedCaseReportFilter.procedureTypeFilter,
    props.procedureType,
  );
  store.set(state.blockedCaseReportFilter.caseStatusFilter, 'All');
  store.set(state.blockedCaseReportFilter.reasonFilter, 'All');
};
