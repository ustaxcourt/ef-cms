import { clearAlertsAction } from '../actions/clearAlertsAction';
import { formatPetitionAction } from '@web-client/presenter/actions/formatPetitionAction';
import { generatePetitionPdfAction } from '@web-client/presenter/actions/generatePetitionPdfAction';
import { getStep1DataAction } from '@web-client/presenter/actions/getStep1DataAction';
import { getStep2DataAction } from '@web-client/presenter/actions/getStep2DataAction';
import { getStep3DataAction } from '@web-client/presenter/actions/getStep3DataAction';
import { getStep4DataAction } from '@web-client/presenter/actions/getStep4DataAction';
import { getStep5DataAction } from '@web-client/presenter/actions/getStep5DataAction';
import { incrementCurrentStepIndicatorAction } from '@web-client/presenter/actions/incrementCurrentStepIndicatorAction';
import { savePetitionDataSequence } from '@web-client/presenter/sequences/savePetitionDataSequence';
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
      getStep1DataAction,
      getStep2DataAction,
      getStep3DataAction,
      getStep4DataAction,
      formatPetitionAction,
      generatePetitionPdfAction,
      setPdfPreviewUrlAction,
      incrementCurrentStepIndicatorAction,
      savePetitionDataSequence,
    ]),
  },
];
