import { setJudgeActivityReportOrdersAndOpinionsDataAction } from '../../actions/JudgeActivityReport/setJudgeActivityReportOrdersAndOpinionsDataAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';

export const fetchOrdersAndOpinionsForJudgesCompleteSequence =
  showProgressSequenceDecorator([
    setJudgeActivityReportOrdersAndOpinionsDataAction,
  ]);
