import { clearModalAction } from '../actions/clearModalAction';
import { dismissThirtyDayAlertFromTrialSessionAction } from '../actions/TrialSession/dismissThirtyDayAlertFromTrialSessionAction';
import { getCalendaredCasesForTrialSessionAction } from '../actions/TrialSession/getCalendaredCasesForTrialSessionAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { mergeCaseOrderIntoCalendaredCasesAction } from '../actions/TrialSession/mergeCaseOrderIntoCalendaredCasesAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setCalendaredCasesOnTrialSessionAction } from '../actions/TrialSession/setCalendaredCasesOnTrialSessionAction';
import { setTrialSessionDetailsAction } from '../actions/TrialSession/setTrialSessionDetailsAction';

export const dismissThirtyDayTrialAlertSequence = [
  clearModalAction,
  dismissThirtyDayAlertFromTrialSessionAction,
  {
    error: [setAlertErrorAction],
    success: [
      getTrialSessionDetailsAction,
      setTrialSessionDetailsAction,
      getCalendaredCasesForTrialSessionAction,
      setCalendaredCasesOnTrialSessionAction,
      mergeCaseOrderIntoCalendaredCasesAction,
    ],
  },
];
