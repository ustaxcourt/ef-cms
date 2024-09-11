import { state } from '@web-client/presenter/app.cerebral';

export const resetBlockedCasesFiltersAction = ({ store }: ActionProps) => {
  store.set(state.blockedCaseReportFilter.caseStatusFilter, 'All');
  store.set(state.blockedCaseReportFilter.procedureTypeFilter, 'All');
  store.set(state.blockedCaseReportFilter.reasonFilter, 'All');
};
