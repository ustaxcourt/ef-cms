import { clearAlertsAction } from '../actions/clearAlertsAction';
import { formatPetitionAction } from '@web-client/presenter/actions/formatPetitionAction';
import { generatePetitionPdfAction } from '@web-client/presenter/actions/generatePetitionPdfAction';
import { generatePetitionPreviewPdfUrlAction } from '@web-client/presenter/actions/generatePetitionPreviewPdfUrlAction';
import { getFilePetitionPetitionInformationAction } from '@web-client/presenter/actions/getFilePetitionPetitionInformationAction';
import { getFilePetitionPetitionerInformationAction } from '@web-client/presenter/actions/getFilePetitionPetitionerInformationAction';
import { getStep3DataAction } from '@web-client/presenter/actions/getStep3DataAction';
import { getStep4DataAction } from '@web-client/presenter/actions/getStep4DataAction';
import { getStep5DataAction } from '@web-client/presenter/actions/getStep5DataAction';
import { incrementCurrentStepIndicatorAction } from '@web-client/presenter/actions/incrementCurrentStepIndicatorAction';
import { setPdfPreviewUrlAction } from '@web-client/presenter/actions/CourtIssuedOrder/setPdfPreviewUrlAction';
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
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      clearAlertsAction,
      stopShowValidationAction,
      getFilePetitionPetitionInformationAction,
      getFilePetitionPetitionerInformationAction,
      getStep3DataAction,
      getStep4DataAction,
      formatPetitionAction,
      generatePetitionPdfAction,
      setPdfPreviewUrlAction,
      generatePetitionPreviewPdfUrlAction,
      incrementCurrentStepIndicatorAction,
    ]),
  },
];