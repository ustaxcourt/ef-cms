import { cloneDeep } from 'lodash';
import { initialJudgeActivityReportState } from '../judgeActivityReportState';
import { state } from 'cerebral';

export const resetJudgeActivityReportStateAction = ({ store }) => {
  store.set(
    state.judgeActivityReport,
    cloneDeep(initialJudgeActivityReportState),
  );
};
