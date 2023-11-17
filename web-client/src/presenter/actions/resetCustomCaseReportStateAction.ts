import { cloneDeep } from 'lodash';
import { initialCustomCaseReportState } from '../customCaseReportState';
import { state } from '@web-client/presenter/app.cerebral';

export const resetCustomCaseReportStateAction = ({
  store,
}: ActionProps): void => {
  store.set(state.customCaseReport, cloneDeep(initialCustomCaseReportState));
};
