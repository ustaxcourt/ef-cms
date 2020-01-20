import { clearAlertsAction } from '../actions/clearAlertsAction';
import { primePropsFromEditDocketRecordEntryModalAction } from '../actions/EditDocketRecordEntry/primePropsFromEditDocketRecordEntryModalAction';
import { setValidationErrorsByFlagAction } from '../actions/WorkItem/setValidationErrorsByFlagAction';
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
        error: [setValidationErrorsByFlagAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
