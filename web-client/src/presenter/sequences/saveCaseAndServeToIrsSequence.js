import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { getServeToIrsAlertSuccessAction } from '../actions/StartCaseInternal/getServeToIrsAlertSuccessAction';
import { isPrintPreviewPreparedAction } from '../actions/CourtIssuedOrder/isPrintPreviewPreparedAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { serveCaseToIrsAction } from '../actions/StartCaseInternal/serveCaseToIrsAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseConfirmationFormDocumentTitleAction } from '../actions/StartCaseInternal/setCaseConfirmationFormDocumentTitleAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const saveCaseAndServeToIrsSequence = [
  clearPdfPreviewUrlAction,
  showProgressSequenceDecorator([
    serveCaseToIrsAction,
    {
      electronic: [],
      paper: [setPdfPreviewUrlAction],
    },
    clearModalAction,
    getServeToIrsAlertSuccessAction,
    setAlertSuccessAction,
    setSaveAlertsForNavigationAction,
    navigateToCaseDetailAction,
    isPrintPreviewPreparedAction,
    {
      no: [],
      yes: [
        clearFormAction,
        setCaseConfirmationFormDocumentTitleAction,
        setShowModalFactoryAction('PaperServiceConfirmModal'),
      ],
    },
  ]),
];
