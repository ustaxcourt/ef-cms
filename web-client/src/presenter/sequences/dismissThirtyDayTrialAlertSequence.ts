import { clearModalAction } from '../actions/clearModalAction';
import { dismissThirtyDayAlertFromTrialSessionAction } from '../actions/TrialSession/dismissThirtyDayAlertFromTrialSessionAction';
import { getCalendaredCasesForTrialSessionAction } from '../actions/TrialSession/getCalendaredCasesForTrialSessionAction';
import { getEligibleCasesForTrialSessionAction } from '../actions/TrialSession/getEligibleCasesForTrialSessionAction';
import { getTrialSessionDetailsAction } from '../actions/TrialSession/getTrialSessionDetailsAction';
import { isTrialSessionCalendaredAction } from '../actions/TrialSession/isTrialSessionCalendaredAction';
import { mergeCaseOrderIntoCalendaredCasesAction } from '../actions/TrialSession/mergeCaseOrderIntoCalendaredCasesAction';
import { mergeCaseOrderIntoEligibleCasesAction } from '../actions/TrialSession/mergeCaseOrderIntoEligibleCasesAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setCalendaredCasesOnTrialSessionAction } from '../actions/TrialSession/setCalendaredCasesOnTrialSessionAction';
import { setEligibleCasesOnTrialSessionAction } from '../actions/TrialSession/setEligibleCasesOnTrialSessionAction';
import { setTrialSessionDetailsAction } from '../actions/TrialSession/setTrialSessionDetailsAction';

export const dismissThirtyDayTrialAlertSequence = [
  clearModalAction,
  dismissThirtyDayAlertFromTrialSessionAction,
  {
    error: [setAlertErrorAction],
    success: [
      getTrialSessionDetailsAction,
      setTrialSessionDetailsAction,
      isTrialSessionCalendaredAction,
      {
        no: [
          getEligibleCasesForTrialSessionAction,
          setEligibleCasesOnTrialSessionAction,
          mergeCaseOrderIntoEligibleCasesAction,
        ],
        yes: [
          getCalendaredCasesForTrialSessionAction,
          setCalendaredCasesOnTrialSessionAction,
          mergeCaseOrderIntoCalendaredCasesAction,
        ],
      },
    ],
  },
];
