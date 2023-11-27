import { cloneDeep } from 'lodash';
import { initialPendingReportsState } from '@web-client/presenter/state/pendingReportState';
import { state } from '@web-client/presenter/app.cerebral';

export const clearPendingReportsAction = ({ store }: ActionProps) => {
  store.set(state.pendingReports, cloneDeep(initialPendingReportsState));
};
