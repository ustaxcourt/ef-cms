import { cloneDeep } from 'lodash';
import { initialBlockedCaseReportFilter } from '@web-client/presenter/state/blockedCasesReportState';
import { state } from '@web-client/presenter/app.cerebral';

export const clearBlockedCasesReportAction = ({ store }: ActionProps) => {
  store.set(
    state.blockedCaseReportFilter,
    cloneDeep(initialBlockedCaseReportFilter),
  );
  store.set(state.blockedCases, []);
};
