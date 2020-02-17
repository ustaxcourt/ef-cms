import { navigateToCaseDetailCaseInformationAction } from '../actions/navigateToCaseDetailCaseInformationAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setPaperServicePartiesAction } from '../actions/setPaperServicePartiesAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { updatePetitionerInformationAction } from '../actions/updatePetitionerInformationAction';
import { validatePetitionerInformationFormAction } from '../actions/validatePetitionerInformationFormAction';

/**
 * attempts to update the petitioner information
 */
export const updatePetitionerInformationFormSequence = [
  startShowValidationAction,
  validatePetitionerInformationFormAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: showProgressSequenceDecorator([
      updatePetitionerInformationAction,
      setPdfPreviewUrlAction,
      setPaperServicePartiesAction,
      setSaveAlertsForNavigationAction,
      setAlertSuccessAction,
      navigateToCaseDetailCaseInformationAction,
    ]),
  },
];
