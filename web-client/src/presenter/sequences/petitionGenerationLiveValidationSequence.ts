import { determineStepPathAction } from '@web-client/presenter/actions/determineStepPathAction';
import { getCreatePetitionStep1DataAction } from '@web-client/presenter/actions/getCreatePetitionStep1DataAction';
import { getCreatePetitionStep2DataAction } from '@web-client/presenter/actions/getCreatePetitionStep2DataAction';
import { getCreatePetitionStep3DataAction } from '@web-client/presenter/actions/getCreatePetitionStep3DataAction';
import { getCreatePetitionStep4DataAction } from '@web-client/presenter/actions/getCreatePetitionStep4DataAction';
import { setSingleValidationErrorAction } from '@web-client/presenter/actions/setSingleValidationErrorAction';
import { startShowValidationAction } from '@web-client/presenter/actions/startShowValidationAction';
import { validateUploadPetitionStep1Action } from '@web-client/presenter/actions/validateUploadPetitionStep1Action';
import { validateUploadPetitionStep2Action } from '@web-client/presenter/actions/validateUploadPetitionStep2Action';
import { validateUploadPetitionStep3Action } from '@web-client/presenter/actions/validateUploadPetitionStep3Action';
import { validateUploadPetitionStep4Action } from '@web-client/presenter/actions/validateUploadPetitionStep4Action';

type ValidationKey = string | { property: string; value: number };
interface Params {
  validationKey: ValidationKey[];
}

const handleValidationErrorsRoute = {
  error: [setSingleValidationErrorAction],
  success: [],
};

export const petitionGenerationLiveValidationSequence = [
  startShowValidationAction,
  determineStepPathAction,
  {
    step1: [
      getCreatePetitionStep1DataAction,
      validateUploadPetitionStep1Action,
      handleValidationErrorsRoute,
    ],
    step2: [
      getCreatePetitionStep2DataAction,
      validateUploadPetitionStep2Action,
      handleValidationErrorsRoute,
    ],
    step3: [
      getCreatePetitionStep3DataAction,
      validateUploadPetitionStep3Action,
      handleValidationErrorsRoute,
    ],
    step4: [
      getCreatePetitionStep4DataAction,
      validateUploadPetitionStep4Action,
      handleValidationErrorsRoute,
    ],
  },
] as unknown as (params: Params) => void;
