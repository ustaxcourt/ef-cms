import { clearAlertsAction } from '../actions/clearAlertsAction';
import { createNewAccountAction } from '../actions/createNewAccountAction';
import { gotoLoginSequence } from './gotoLoginSequence';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';

export const createNewAccountLocalSequence = [
  clearAlertsAction,
  startShowValidationAction,
  createNewAccountAction,
  {
    no: [setAlertErrorAction],
    yes: [
      setAlertSuccessAction,
      setSaveAlertsForNavigationAction,
      gotoLoginSequence,
    ],
  },
];
