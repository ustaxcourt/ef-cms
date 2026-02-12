import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearNewMinuteSheetModalCaseInfoAction } from '../actions/TrialSessionMinutes/clearNewMinuteSheetModalCaseInfoAction';
import { searchNewMinuteSheetCaseAction } from '../actions/TrialSessionMinutes/searchNewMinuteSheetCaseAction';
import { setNewMinuteSheetModalCaseInfoAction } from '../actions/TrialSessionMinutes/setNewMinuteSheetModalCaseInfoAction';
import { setNewMinuteSheetModalSearchErrorAction } from '../actions/TrialSessionMinutes/setNewMinuteSheetModalSearchErrorAction';

export const searchNewMinuteSheetCaseSequence = [
  clearAlertsAction,
  clearNewMinuteSheetModalCaseInfoAction,
  searchNewMinuteSheetCaseAction,
  {
    caseAlreadyOnTrialSession: [setNewMinuteSheetModalSearchErrorAction],
    error: [setNewMinuteSheetModalSearchErrorAction],
    success: [setNewMinuteSheetModalCaseInfoAction],
  },
];
