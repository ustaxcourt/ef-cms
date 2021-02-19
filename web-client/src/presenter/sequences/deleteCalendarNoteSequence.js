import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { saveCalendarNoteAction } from '../actions/TrialSession/saveCalendarNoteAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { updateTrialSessionInTrialSessionsAction } from '../actions/updateTrialSessionInTrialSessionsAction';

export const deleteCalendarNoteSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  clearModalStateAction,
  saveCalendarNoteAction,
  updateTrialSessionInTrialSessionsAction,
  setAlertSuccessAction,
  clearModalAction,
  clearModalStateAction,
]);
