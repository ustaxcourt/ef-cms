import { clearAlertsAction } from '../actions/clearAlertsAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateCourtIssuedDocketEntryAction } from '../actions/CourtIssuedDocketEntry/validateCourtIssuedDocketEntryAction';

export const validateCourtIssuedDocketEntrySequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      getComputedFormDateFactoryAction(null), // TODO: Remove this?
      validateCourtIssuedDocketEntryAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
