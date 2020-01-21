import { clearAlertsAction } from '../actions/clearAlertsAction';
import { primePropsFromEditDocketEntryMetaModalAction } from '../actions/EditDocketRecordEntry/primePropsFromEditDocketEntryMetaModalAction';
import { setValidationErrorsByFlagAction } from '../actions/WorkItem/setValidationErrorsByFlagAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateDocketRecordAction } from '../actions/EditDocketRecordEntry/validateDocketRecordAction';

export const validateDocketRecordSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      primePropsFromEditDocketEntryMetaModalAction,
      validateDocketRecordAction,
      {
        error: [setValidationErrorsByFlagAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
