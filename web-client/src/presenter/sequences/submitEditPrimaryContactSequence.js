import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { parallel } from 'cerebral/factories';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setDocumentDetailTabAction } from '../actions/setDocumentDetailTabAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updatePrimaryContactAction } from '../actions/updatePrimaryContactAction';
import { validatePrimaryContactAction } from '../actions/validatePrimaryContactAction';

export const submitEditPrimaryContactSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validatePrimaryContactAction,
  {
    error: [setValidationAlertErrorsAction],
    success: [
      setWaitingForResponseAction,
      updatePrimaryContactAction,
      parallel([setDocumentDetailTabAction, setAlertSuccessAction]),
      unsetWaitingForResponseAction,
      setSaveAlertsForNavigationAction,
      setCurrentPageAction('Interstitial'),
      navigateToCaseDetailAction,
    ],
  },
];
