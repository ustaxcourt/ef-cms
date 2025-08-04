import { getCaseDeadlinesAction } from '../actions/CaseDeadline/getCaseDeadlinesAction';
import { setCaseDeadlinesAction } from '../actions/CaseDeadline/setCaseDeadlinesAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const updateCaseDeadlineReportPageSequence =
  showProgressSequenceDecorator([
    getCaseDeadlinesAction,
    setCaseDeadlinesAction,
  ]) as unknown as (props: { selectedPage: number }) => void;
