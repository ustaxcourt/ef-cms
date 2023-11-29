import { clearAlertsAction } from '../actions/clearAlertsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateDocketEntryWorksheetAction } from '@web-client/presenter/actions/validateDocketEntryWorksheetAction';

export const validateDocketEntryWorksheetSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      validateDocketEntryWorksheetAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
