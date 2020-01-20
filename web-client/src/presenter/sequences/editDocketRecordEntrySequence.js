import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { primePropsFromEditDocketRecordEntryModalAction } from '../actions/EditDocketRecordEntry/primePropsFromEditDocketRecordEntryModalAction';
import { setValidationErrorsByFlagAction } from '../actions/WorkItem/setValidationErrorsByFlagAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateDocketRecordAction } from '../actions/EditDocketRecordEntry/validateDocketRecordAction';

export const editDocketRecordEntrySequence = [
  startShowValidationAction,
  primePropsFromEditDocketRecordEntryModalAction,
  validateDocketRecordAction,
  {
    error: [setValidationErrorsByFlagAction],
    success: [
      stopShowValidationAction,
      clearAlertsAction,
      clearModalAction,
      clearModalStateAction,
    ],
  },
];
