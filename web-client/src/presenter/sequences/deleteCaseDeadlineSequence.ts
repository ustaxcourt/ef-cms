import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearScreenMetadataAction } from '../actions/clearScreenMetadataAction';
import { deleteCaseDeadlineAction } from '../actions/CaseDeadline//deleteCaseDeadlineAction';
import { getCaseDeadlinesForCaseAction } from '../actions/CaseDeadline/getCaseDeadlinesForCaseAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const deleteCaseDeadlineSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  deleteCaseDeadlineAction,
  {
    success: [],
  },
  clearFormAction,
  clearScreenMetadataAction,
  clearModalAction,
  getCaseDeadlinesForCaseAction,
]);
