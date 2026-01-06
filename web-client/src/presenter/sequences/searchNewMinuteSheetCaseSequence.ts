import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearNewMinuteSheetModalCaseInfoAction } from '../actions/TrialSession/clearNewMinuteSheetModalCaseInfoAction';
import { searchNewMinuteSheetCaseAction } from '../actions/TrialSession/searchNewMinuteSheetCaseAction';
import { setNewMinuteSheetModalCaseInfoAction } from '../actions/TrialSession/setNewMinuteSheetModalCaseInfoAction';
import { setNewMinuteSheetModalSearchErrorAction } from '../actions/TrialSession/setNewMinuteSheetModalSearchErrorAction';

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
