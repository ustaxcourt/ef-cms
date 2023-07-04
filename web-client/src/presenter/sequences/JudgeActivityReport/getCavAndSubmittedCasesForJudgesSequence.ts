import { getSubmittedAndCavCasesByJudgeAction } from '../../actions/JudgeActivityReport/getSubmittedAndCavCasesByJudgeAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';

export const getCavAndSubmittedCasesForJudgesSequence =
  showProgressSequenceDecorator([getSubmittedAndCavCasesByJudgeAction]);
