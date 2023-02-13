import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deleteCalendarNoteAction } from '../actions/TrialSession/deleteCalendarNoteAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { updateTrialSessionInTrialSessionsAction } from '../actions/updateTrialSessionInTrialSessionsAction';

export const deleteCalendarNoteSequence = showProgressSequenceDecorator([
  clearAlertsAction,
  deleteCalendarNoteAction,
  updateTrialSessionInTrialSessionsAction,
  setAlertSuccessAction,
  clearModalAction,
  clearModalStateAction,
]);
