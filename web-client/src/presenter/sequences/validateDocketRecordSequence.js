import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeFilingFormDateAction } from '../actions/FileDocument/computeFilingFormDateAction';
import { setValidationErrorsByFlagAction } from '../actions/WorkItem/setValidationErrorsByFlagAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateDocketRecordAction } from '../actions/EditDocketRecordEntry/validateDocketRecordAction';

export const validateDocketRecordSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      computeFilingFormDateAction,
      validateDocketRecordAction,
      {
        error: [setValidationErrorsByFlagAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
