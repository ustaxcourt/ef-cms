import { clearAlertsAction } from '../actions/clearAlertsAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseDetailShowEditPetitionFalseAction } from '../actions/setCaseDetailShowEditPetitionFalseAction';
import { setCaseTypeAction } from '../actions/setCaseTypeAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setScrollToErrorNotificationAction } from '@web-client/presenter/actions/setScrollToErrorNotificationAction';
import { setValidationAlertErrorsAction } from '@web-client/presenter/actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setupCurrentPageAction } from '../actions/setupCurrentPageAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { updateCaseDetailsAction } from '../actions/updateCaseDetailsAction';
import { validateCaseDetailsAction } from '../actions/validateCaseDetailsAction';

export const updateCaseDetailsSequence = [
  clearAlertsAction,
  startShowValidationAction,
  validateCaseDetailsAction,
  {
    error: [
      setValidationErrorsAction,
      setScrollToErrorNotificationAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      setupCurrentPageAction('Interstitial'),
      setCaseTypeAction,
      updateCaseDetailsAction,
      setCaseAction,
      setCaseDetailShowEditPetitionFalseAction,
      setSaveAlertsForNavigationAction,
      setAlertSuccessAction,
      setAlertErrorAction,
      navigateToCaseDetailCaseInformationActionFactory(),
    ],
  },
];
