import { navigateToCaseDetailCaseInformationAction } from '../actions/navigateToCaseDetailCaseInformationAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { updatePetitionerInformationAction } from '../actions/updatePetitionerInformationAction';
import { validatePetitionerInformationFormAction } from '../actions/validatePetitionerInformationFormAction';

/**
 * attempts to update the petitioner information
 */
export const updatePetitionerInformationFormSequence = [
  startShowValidationAction,
  validatePetitionerInformationFormAction,
  {
    error: [setValidationErrorsAction],
    success: [
      setWaitingForResponseAction,
      updatePetitionerInformationAction,
      unsetWaitingForResponseAction,
      setSaveAlertsForNavigationAction,
      setAlertSuccessAction,
      navigateToCaseDetailCaseInformationAction,
    ],
  },
];
