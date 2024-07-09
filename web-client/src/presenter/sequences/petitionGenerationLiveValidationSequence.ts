import { determineStepPathAction } from '@web-client/presenter/actions/determineStepPathAction';
import { getStep1DataAction } from '@web-client/presenter/actions/getStep1DataAction';
import { getStep2DataAction } from '@web-client/presenter/actions/getStep2DataAction';
import { getStep3DataAction } from '@web-client/presenter/actions/getStep3DataAction';
import { getStep4DataAction } from '@web-client/presenter/actions/getStep4DataAction';
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
      getStep1DataAction,
      validateUploadPetitionStep1Action,
      handleValidationErrorsRoute,
    ],
    step2: [
      getStep2DataAction,
      validateUploadPetitionStep2Action,
      handleValidationErrorsRoute,
    ],
    step3: [
      getStep3DataAction,
      validateUploadPetitionStep3Action,
      handleValidationErrorsRoute,
    ],
    step4: [
      getStep4DataAction,
      validateUploadPetitionStep4Action,
      handleValidationErrorsRoute,
    ],
  },
] as unknown as (params: Params) => void;
