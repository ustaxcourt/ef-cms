import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getEditDocketEntryMetaAlertSuccessAction } from '../actions/EditDocketRecordEntry/getEditDocketEntryMetaAlertSuccessAction';
import { primePropsFromEditDocketEntryMetaModalAction } from '../actions/EditDocketRecordEntry/primePropsFromEditDocketEntryMetaModalAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setValidationErrorsByFlagAction } from '../actions/WorkItem/setValidationErrorsByFlagAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateDocketEntryMetaAction } from '../actions/EditDocketRecordEntry/updateDocketEntryMetaAction';
import { validateDocketRecordAction } from '../actions/EditDocketRecordEntry/validateDocketRecordAction';

export const submitEditDocketEntryMetaSequence = [
  startShowValidationAction,
  primePropsFromEditDocketEntryMetaModalAction,
  validateDocketRecordAction,
  {
    error: [setValidationErrorsByFlagAction],
    success: [
      stopShowValidationAction,
      clearAlertsAction,
      updateDocketEntryMetaAction,
      clearModalAction,
      clearModalStateAction,
      getEditDocketEntryMetaAlertSuccessAction,
      setAlertSuccessAction,
    ],
  },
];
