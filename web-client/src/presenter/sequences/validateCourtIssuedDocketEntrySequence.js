import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeFormDateFactoryAction } from '../actions/computeFormDateFactoryAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateCourtIssuedDocketEntryAction } from '../actions/CourtIssuedDocketEntry/validateCourtIssuedDocketEntryAction';

export const validateCourtIssuedDocketEntrySequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      computeFormDateFactoryAction(null),
      validateCourtIssuedDocketEntryAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
