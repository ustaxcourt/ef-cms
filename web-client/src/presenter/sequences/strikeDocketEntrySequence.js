import { clearModalAction } from '../actions/clearModalAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { strikeDocketEntryAction } from '../actions/EditDocketRecordEntry/strikeDocketEntryAction';

export const strikeDocketEntrySequence = [
  clearModalAction,
  strikeDocketEntryAction,
  {
    error: [setAlertErrorAction],
    success: [
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      navigateToCaseDetailAction,
    ],
  },
];
