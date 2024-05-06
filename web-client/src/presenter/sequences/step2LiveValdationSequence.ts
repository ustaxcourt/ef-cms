import { getStep2DataAction } from '@web-client/presenter/actions/getStep2DataAction';
import { setSingleValidationErrorAction } from '@web-client/presenter/actions/getSingleValidationMessageAction';
import { startShowValidationAction } from '@web-client/presenter/actions/startShowValidationAction';
import { validateUploadPetitionStep2Action } from '@web-client/presenter/actions/validateUploadPetitionStep2Action';

export const step2LiveValdationSequence = [
  startShowValidationAction,
  getStep2DataAction,
  validateUploadPetitionStep2Action,
  {
    error: [setSingleValidationErrorAction],
    success: [],
  },
];
