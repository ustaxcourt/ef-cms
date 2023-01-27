import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearErrorAlertsAction } from '../actions/clearErrorAlertsAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setPaperPetitionDatesSequence } from './setPaperPetitionDatesSequence';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validatePetitionFromPaperAction } from '../actions/validatePetitionFromPaperAction';

export const validatePetitionFromPaperSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      setPaperPetitionDatesSequence,
      validatePetitionFromPaperAction,
      {
        error: [
          setAlertErrorAction,
          setValidationErrorsAction,
          setValidationAlertErrorsAction,
        ],
        success: [clearAlertsAction, clearErrorAlertsAction],
      },
    ],
  },
];
