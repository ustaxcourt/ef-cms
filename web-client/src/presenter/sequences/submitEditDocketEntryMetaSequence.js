import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { computeFilingFormDateAction } from '../actions/FileDocument/computeFilingFormDateAction';
import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';
import { getEditDocketEntryMetaAlertSuccessAction } from '../actions/EditDocketRecordEntry/getEditDocketEntryMetaAlertSuccessAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { primePropsFromEditDocketEntryMetaModalAction } from '../actions/EditDocketRecordEntry/primePropsFromEditDocketEntryMetaModalAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateDocketEntryMetaAction } from '../actions/EditDocketRecordEntry/updateDocketEntryMetaAction';
import { validateDocketRecordAction } from '../actions/EditDocketRecordEntry/validateDocketRecordAction';

export const submitEditDocketEntryMetaSequence = [
  startShowValidationAction,
  computeFilingFormDateAction,
  computeCertificateOfServiceFormDateAction,
  primePropsFromEditDocketEntryMetaModalAction,
  generateCourtIssuedDocumentTitleAction,
  validateDocketRecordAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      stopShowValidationAction,
      clearAlertsAction,
      updateDocketEntryMetaAction,
      {
        error: [setAlertErrorAction],
        success: [
          clearModalAction,
          clearModalStateAction,
          setSaveAlertsForNavigationAction,
          getEditDocketEntryMetaAlertSuccessAction,
          setAlertSuccessAction,
          navigateToCaseDetailAction,
        ],
      },
    ],
  },
];
