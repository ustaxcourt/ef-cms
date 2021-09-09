import { clearCaseDeadlinesAction } from '../actions/CaseDeadline/clearCaseDeadlinesAction';
import { getCaseDeadlinesAction } from '../actions/CaseDeadline/getCaseDeadlinesAction';
import { setCaseDeadlineReportJudgeFilterAction } from '../actions/CaseDeadline/setCaseDeadlineReportJudgeFilterAction';
import { setCaseDeadlinesAction } from '../actions/CaseDeadline/setCaseDeadlinesAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const filterCaseDeadlinesByJudgeSequence = showProgressSequenceDecorator(
  [
    clearCaseDeadlinesAction,
    setCaseDeadlineReportJudgeFilterAction,
    getCaseDeadlinesAction,
    setCaseDeadlinesAction,
  ],
);
