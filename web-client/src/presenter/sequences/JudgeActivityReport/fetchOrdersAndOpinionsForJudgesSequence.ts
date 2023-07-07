import { setJudgeActivityReportDataAction } from '@web-client/presenter/actions/JudgeActivityReport/setJudgeActivityReportDataAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';

export const fetchOrdersAndOpinionsForJudgesCompleteSequence =
  showProgressSequenceDecorator([setJudgeActivityReportDataAction]);
