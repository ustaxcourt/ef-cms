import { checkJudgeActivityReportOpinionsAndOrdersIsSetAction } from '../../actions/JudgeActivityReport/checkJudgeActivityReportOpinionsAndOrdersIsSetAction';
import { setJudgeActivityReportOrdersAndOpinionsDataAction } from '../../actions/JudgeActivityReport/setJudgeActivityReportOrdersAndOpinionsDataAction';
import { unsetWaitingForResponseAction } from '@web-client/presenter/actions/unsetWaitingForResponseAction';

export const fetchOrdersAndOpinionsForJudgesCompleteSequence = [
  setJudgeActivityReportOrdersAndOpinionsDataAction,
  checkJudgeActivityReportOpinionsAndOrdersIsSetAction,
  {
    no: [],
    yes: [unsetWaitingForResponseAction],
  },
];
