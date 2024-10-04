import { clearAlertsAction } from '../actions/clearAlertsAction';
import { formatPetitionAction } from '@web-client/presenter/actions/formatPetitionAction';
import { generatePetitionPreviewPdfUrlAction } from '@web-client/presenter/actions/generatePetitionPreviewPdfUrlAction';
import { getCreatePetitionStep1DataAction } from '@web-client/presenter/actions/getCreatePetitionStep1DataAction';
import { getCreatePetitionStep2DataAction } from '@web-client/presenter/actions/getCreatePetitionStep2DataAction';
import { getCreatePetitionStep3DataAction } from '@web-client/presenter/actions/getCreatePetitionStep3DataAction';
import { getCreatePetitionStep4DataAction } from '@web-client/presenter/actions/getCreatePetitionStep4DataAction';
import { getCreatePetitionStep5DataAction } from '@web-client/presenter/actions/getCreatePetitionStep5DataAction';
import { incrementCurrentStepIndicatorAction } from '@web-client/presenter/actions/incrementCurrentStepIndicatorAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { showProgressSequenceDecorator } from '@web-client/presenter/utilities/showProgressSequenceDecorator';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateUploadPetitionStep5Action } from '@web-client/presenter/actions/validateUploadPetitionStep5Action';

export const filePetitionCompleteStep5Sequence = [
  startShowValidationAction,
  getCreatePetitionStep5DataAction,
  validateUploadPetitionStep5Action,
  {
    error: [setValidationErrorsAction],
    success: showProgressSequenceDecorator([
      clearAlertsAction,
      stopShowValidationAction,
      getCreatePetitionStep1DataAction,
      getCreatePetitionStep2DataAction,
      getCreatePetitionStep3DataAction,
      getCreatePetitionStep4DataAction,
      formatPetitionAction,
      generatePetitionPreviewPdfUrlAction,
      incrementCurrentStepIndicatorAction,
    ]),
  },
] as unknown as () => void;
