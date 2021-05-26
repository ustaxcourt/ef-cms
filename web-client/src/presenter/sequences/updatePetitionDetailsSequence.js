import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeStatisticDatesAction } from '../actions/StartCaseInternal/computeStatisticDatesAction';
import { navigateToCaseDetailCaseInformationActionFactory } from '../actions/navigateToCaseDetailCaseInformationActionFactory';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseDetailShowEditPetitionFalseAction } from '../actions/setCaseDetailShowEditPetitionFalseAction';
import { setCaseTypeAction } from '../actions/setCaseTypeAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { updatePetitionDetailsAction } from '../actions/updatePetitionDetailsAction';
import { validatePetitionDetailsAction } from '../actions/validatePetitionDetailsAction';

export const updatePetitionDetailsSequence = [
  clearAlertsAction,
  startShowValidationAction,
  computeStatisticDatesAction,
  validatePetitionDetailsAction,
  {
    error: [setAlertErrorAction, setValidationErrorsAction],
    success: [
      setCurrentPageAction('Interstitial'),
      setCaseTypeAction,
      updatePetitionDetailsAction,
      setCaseAction,
      setCaseDetailShowEditPetitionFalseAction,
      setSaveAlertsForNavigationAction,
      setAlertSuccessAction,
      setAlertErrorAction,
      navigateToCaseDetailCaseInformationActionFactory(),
    ],
  },
];
