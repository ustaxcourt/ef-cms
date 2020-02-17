import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeDateReceivedAction } from '../actions/DocketEntry/computeDateReceivedAction';
import { computeIrsNoticeDateAction } from '../actions/StartCaseInternal/computeIrsNoticeDateAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validatePetitionFromPaperAction } from '../actions/validatePetitionFromPaperAction';

export const validatePetitionFromPaperSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      computeDateReceivedAction,
      computeIrsNoticeDateAction,
      validatePetitionFromPaperAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
