import { state } from '@web-client/presenter/app.cerebral';

export const clearOptionalCustomCaseReportFilterAction = ({
  store,
}: ActionProps) => {
  store.set(state.customCaseReport.filters.caseStatuses, []);
  store.set(state.customCaseReport.filters.caseTypes, []);
  store.set(state.customCaseReport.filters.judges, []);
  store.set(state.customCaseReport.filters.preferredTrialCities, []);
};
