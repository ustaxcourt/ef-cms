import { cloneDeep } from 'lodash';
import { initialJudgeActivityReportState } from '@web-client/presenter/judgeActivityReportState';
import { state } from '@web-client/presenter/app.cerebral';

export const resetJudgeActivityReportDataAction = ({ store }: ActionProps) => {
  store.set(
    state.judgeActivityReport.judgeActivityReportData,
    cloneDeep(initialJudgeActivityReportState.judgeActivityReportData),
  );
};
