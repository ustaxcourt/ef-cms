import { chooseMetaTypePathAction } from '../actions/EditDocketRecordEntry/chooseMetaTypePathAction';
import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { computeFilingFormDateAction } from '../actions/FileDocument/computeFilingFormDateAction';
import { computeFormDateAction } from '../actions/computeFormDateAction';
import { generateCourtIssuedDocumentTitleAction } from '../actions/CourtIssuedDocketEntry/generateCourtIssuedDocumentTitleAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { getEditDocketEntryMetaAlertSuccessAction } from '../actions/EditDocketRecordEntry/getEditDocketEntryMetaAlertSuccessAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { primePropsFromEditDocketEntryMetaModalAction } from '../actions/EditDocketRecordEntry/primePropsFromEditDocketEntryMetaModalAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setFormDateAction } from '../actions/setFormDateAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { setupUploadMetadataAction } from '../actions/uploadCourtIssuedDocument/setupUploadMetadataAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { stopShowValidationAction } from '../actions/stopShowValidationAction';
import { updateDocketEntryMetaAction } from '../actions/EditDocketRecordEntry/updateDocketEntryMetaAction';
import { validateDocumentAction } from '../actions/EditDocketRecordEntry/validateDocumentAction';

export const submitEditDocketEntryMetaSequence = [
  startShowValidationAction,
  computeFilingFormDateAction,
  computeCertificateOfServiceFormDateAction,
  computeFormDateAction,
  setFormDateAction,
  primePropsFromEditDocketEntryMetaModalAction,
  chooseMetaTypePathAction,
  {
    courtIssued: [
      generateCourtIssuedDocumentTitleAction,
      setupUploadMetadataAction,
    ],
    document: [generateTitleAction],
    noDocument: [],
  },
  validateDocumentAction,
  {
    error: [
      setAlertErrorAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: showProgressSequenceDecorator([
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
    ]),
  },
];
