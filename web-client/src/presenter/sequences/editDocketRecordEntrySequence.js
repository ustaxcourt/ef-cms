import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getEditDocketRecordEntryAlertSuccessAction } from '../actions/EditDocketRecordEntry/getEditDocketRecordEntryAlertSuccessAction';
import { primePropsFromEditDocketEntryMetaModalAction } from '../actions/EditDocketRecordEntry/primePropsFromEditDocketEntryMetaModalAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setValidationErrorsByFlagAction } from '../actions/WorkItem/setValidationErrorsByFlagAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { validateDocketRecordAction } from '../actions/EditDocketRecordEntry/validateDocketRecordAction';

export const editDocketRecordEntrySequence = [
  startShowValidationAction,
  primePropsFromEditDocketEntryMetaModalAction,
  validateDocketRecordAction,
  {
    error: [setValidationErrorsByFlagAction],
    success: [
      stopShowValidationAction,
      clearAlertsAction,
      clearModalAction,
      clearModalStateAction,
      getEditDocketRecordEntryAlertSuccessAction,
      setAlertSuccessAction,
    ],
  },
];
