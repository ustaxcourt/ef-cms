import { clearAlertsAction } from '../actions/clearAlertsAction';
import { computeDateReceivedAction } from '../actions/DocketEntry/computeDateReceivedAction';
import { computeFilingFormDateAction } from '../actions/FileDocument/computeFilingFormDateAction';
import { setValidationErrorsByFlagAction } from '../actions/WorkItem/setValidationErrorsByFlagAction';
import { shouldValidateAction } from '../actions/shouldValidateAction';
import { validateDocumentAction } from '../actions/EditDocketRecordEntry/validateDocumentAction';

export const validateDocumentSequence = [
  shouldValidateAction,
  {
    ignore: [],
    validate: [
      computeFilingFormDateAction,
      computeDateReceivedAction,
      validateDocumentAction,
      {
        error: [setValidationErrorsByFlagAction],
        success: [clearAlertsAction],
      },
    ],
  },
];
