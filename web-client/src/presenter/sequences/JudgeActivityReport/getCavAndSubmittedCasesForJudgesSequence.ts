import { getSubmittedAndCavCasesByJudgeAction } from '../../actions/JudgeActivityReport/getSubmittedAndCavCasesByJudgeAction';
import { setCavAndSubmittedCasesAction } from '@web-client/presenter/actions/JudgeActivityReport/setCavAndSubmittedCasesAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';

export const getCavAndSubmittedCasesForJudgesSequence =
  showProgressSequenceDecorator([
    getSubmittedAndCavCasesByJudgeAction,
    setCavAndSubmittedCasesAction,
  ]);
