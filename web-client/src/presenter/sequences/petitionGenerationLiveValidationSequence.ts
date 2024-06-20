import { determineStepPathAction } from '@web-client/presenter/actions/determineStepPathAction';
import { getFilePetitionPetitionInformationAction } from '@web-client/presenter/actions/getFilePetitionPetitionInformationAction';
import { getFilePetitionPetitionerInformationAction } from '@web-client/presenter/actions/getFilePetitionPetitionerInformationAction';
import { getStep3DataAction } from '@web-client/presenter/actions/getStep3DataAction';
import { getStep4DataAction } from '@web-client/presenter/actions/getStep4DataAction';
import { setSingleValidationErrorAction } from '@web-client/presenter/actions/setSingleValidationErrorAction';
import { startShowValidationAction } from '@web-client/presenter/actions/startShowValidationAction';
import { validateFilePetitionPetitionInformationAction } from '@web-client/presenter/actions/validateFilePetitionPetitionInformationAction';
import { validateFilePetitionPetitionerInformationAction } from '@web-client/presenter/actions/validateFilePetitionPetitionerInformationAction';
import { validateUploadPetitionStep3Action } from '@web-client/presenter/actions/validateUploadPetitionStep3Action';
import { validateUploadPetitionStep4Action } from '@web-client/presenter/actions/validateUploadPetitionStep4Action';

const handleValidationErrorsRoute = {
  error: [setSingleValidationErrorAction],
  success: [],
};

export const petitionGenerationLiveValidationSequence = [
  startShowValidationAction,
  determineStepPathAction,
  {
    PetitionInformation: [
      getFilePetitionPetitionInformationAction,
      validateFilePetitionPetitionInformationAction,
      handleValidationErrorsRoute,
    ],

    PetitionerInformation: [
      getFilePetitionPetitionerInformationAction,
      validateFilePetitionPetitionerInformationAction,
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
];
