import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeIrsNoticeDateAction } from '../actions/StartCaseInternal/computeIrsNoticeDateAction';
import { computePetitionFeeDatesAction } from '../actions/StartCaseInternal/computePetitionFeeDatesAction';
import { computeReceivedAtDateAction } from '../actions/caseDetailEdit/computeReceivedAtDateAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validatePetitionFromPaperAction } from '../actions/validatePetitionFromPaperAction';

export const validatePetitionFromPaperSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      computeReceivedAtDateAction,
      computeIrsNoticeDateAction,
      computePetitionFeeDatesAction,
      validatePetitionFromPaperAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
