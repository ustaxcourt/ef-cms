import { clearCaseDeadlinesAction } from '../actions/CaseDeadline/clearCaseDeadlinesAction';
import { getCaseDeadlinesAction } from '../actions/CaseDeadline/getCaseDeadlinesAction';
import { setCaseDeadlinesAction } from '../actions/CaseDeadline/setCaseDeadlinesAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const updateCaseDeadlineReportPageSequence =
  showProgressSequenceDecorator([
    clearCaseDeadlinesAction,
    getCaseDeadlinesAction,
    setCaseDeadlinesAction,
  ]) as unknown as (props: { selectedPage: number }) => void;
