import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';
import { getEditDocketEntryMetaAlertSuccessAction } from '../actions/EditDocketRecordEntry/getEditDocketEntryMetaAlertSuccessAction';
import { primePropsFromEditDocketEntryMetaModalAction } from '../actions/EditDocketRecordEntry/primePropsFromEditDocketEntryMetaModalAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setValidationErrorsByFlagAction } from '../actions/WorkItem/setValidationErrorsByFlagAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateDocketEntryMetaAction } from '../actions/EditDocketRecordEntry/updateDocketEntryMetaAction';
import { validateDocketRecordAction } from '../actions/EditDocketRecordEntry/validateDocketRecordAction';

import { gotoCaseDetailSequence } from './gotoCaseDetailSequence';

export const submitEditDocketEntryMetaSequence = [
  startShowValidationAction,
  primePropsFromEditDocketEntryMetaModalAction,
  generateCourtIssuedDocumentTitleAction,
  validateDocketRecordAction,
  {
    error: [setValidationErrorsByFlagAction],
    success: [
      stopShowValidationAction,
      clearAlertsAction,
      updateDocketEntryMetaAction,
      {
        error: [setAlertErrorAction],
        success: [
          clearModalAction,
          clearModalStateAction,
          getEditDocketEntryMetaAlertSuccessAction,
          setAlertSuccessAction,
          ...gotoCaseDetailSequence, // Needs to refresh the formatted case detail / docket record,
        ],
      },
    ],
  },
];
