import { determineStepPathAction } from '@web-client/presenter/actions/determineStepPathAction';
import { getStep3DataAction } from '@web-client/presenter/actions/getStep3DataAction';
import { setSingleValidationErrorAction } from '@web-client/presenter/actions/getSingleValidationMessageAction';
import { startShowValidationAction } from '@web-client/presenter/actions/startShowValidationAction';
import { validateUploadPetitionStep3Action } from '@web-client/presenter/actions/validateUploadPetitionStep3Action';

const handleValidationErrorsRoute = {
  error: [setSingleValidationErrorAction],
  success: [],
};

export const petitionGenerationLiveValidationSequence = [
  startShowValidationAction,
  determineStepPathAction,
  {
    step3: [
      getStep3DataAction,
      validateUploadPetitionStep3Action,
      handleValidationErrorsRoute,
    ],
  },
];
