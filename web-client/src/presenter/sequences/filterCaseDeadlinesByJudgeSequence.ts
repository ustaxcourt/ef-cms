import { setCaseDeadlineReportJudgeFilterAction } from '../actions/CaseDeadline/setCaseDeadlineReportJudgeFilterAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const filterCaseDeadlinesByJudgeSequence = showProgressSequenceDecorator(
  [
    setCaseDeadlineReportJudgeFilterAction, 
  ],
);
