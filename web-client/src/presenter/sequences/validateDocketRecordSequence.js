import { clearAlertsAction } from '../actions/clearAlertsAction';
import { primePropsFromEditDocketRecordEntryModalAction } from '../actions/EditDocketRecordEntry/primePropsFromEditDocketRecordEntryModalAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateDocketRecordAction } from '../actions/EditDocketRecordEntry/validateDocketRecordAction';

export const validateDocketRecordSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      primePropsFromEditDocketRecordEntryModalAction,
      validateDocketRecordAction,
      {
        error: [setValidationErrorsAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
