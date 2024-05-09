import { clearAlertsAction } from '../actions/clearAlertsAction';
import { generatePetitionPdfAction } from '@web-client/presenter/actions/generatePetitionPdfAction';
import { getStep5DataAction } from '@web-client/presenter/actions/getStep5DataAction';
import { incrementCurrentStepIndicatorAction } from '@web-client/presenter/actions/incrementCurrentStepIndicatorAction';
import { setPdfPreviewUrlAction } from '@web-client/presenter/actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateUploadPetitionStep5Action } from '@web-client/presenter/actions/validateUploadPetitionStep5Action';

export const updatedFilePetitionCompleteStep5Sequence = [
  startShowValidationAction,
  getStep5DataAction,
  validateUploadPetitionStep5Action,
  {
    error: [setValidationErrorsAction, setValidationAlertErrorsAction],
    success: showProgressSequenceDecorator([
      clearAlertsAction,
      stopShowValidationAction,
      generatePetitionPdfAction,
      setPdfPreviewUrlAction,
      incrementCurrentStepIndicatorAction,
    ]),
  },
];
