import { getStep3DataAction } from '@web-client/presenter/actions/getStep3DataAction';
import { setSingleValidationErrorAction } from '@web-client/presenter/actions/getSingleValidationMessageAction';
import { startShowValidationAction } from '@web-client/presenter/actions/startShowValidationAction';
import { validateUploadPetitionStep3Action } from '@web-client/presenter/actions/validateUploadPetitionStep3Action';

export const step3LiveValdationSequence = [
  startShowValidationAction,
  getStep3DataAction,
  validateUploadPetitionStep3Action,
  {
    error: [setSingleValidationErrorAction],
    success: [],
  },
];
