import { clearAlertsAction } from '../actions/clearAlertsAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { computeCertificateOfServiceFormDateAction } from '../actions/FileDocument/computeCertificateOfServiceFormDateAction';
import { generateTitleForPaperFilingAction } from '../actions/FileDocument/generateTitleForPaperFilingAction';
import { getComputedFormDateFactoryAction } from '../actions/getComputedFormDateFactoryAction';
import { setComputeFormDateFactoryAction } from '../actions/setComputeFormDateFactoryAction';
import { setDocumentIsRequiredAction } from '../actions/DocketEntry/setDocumentIsRequiredAction';
import { setFilersFromFilersMapAction } from '../actions/setFilersFromFilersMapAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setValidationAlertErrorsAction } from '../actions/setValidationAlertErrorsAction';
import { setValidationErrorsAction } from '../actions/setValidationErrorsAction';
import { startShowValidationAction } from '../actions/startShowValidationAction';
import { suggestSaveForLaterValidationAction } from '../actions/DocketEntry/suggestSaveForLaterValidationAction';
import { validateDocketEntryAction } from '../actions/DocketEntry/validateDocketEntryAction';

export const openConfirmPaperServiceModalSequence = [
  clearAlertsAction,
  startShowValidationAction,
  getComputedFormDateFactoryAction('serviceDate'),
  setComputeFormDateFactoryAction('serviceDate'),
  computeCertificateOfServiceFormDateAction,
  getComputedFormDateFactoryAction('dateReceived'),
  setComputeFormDateFactoryAction('dateReceived'),
  setDocumentIsRequiredAction,
  generateTitleForPaperFilingAction,
  setFilersFromFilersMapAction,
  validateDocketEntryAction,
  {
    error: [
      suggestSaveForLaterValidationAction,
      setValidationErrorsAction,
      setValidationAlertErrorsAction,
    ],
    success: [
      clearModalStateAction,
      setShowModalFactoryAction('ConfirmInitiateServiceModal'),
    ],
  },
];
