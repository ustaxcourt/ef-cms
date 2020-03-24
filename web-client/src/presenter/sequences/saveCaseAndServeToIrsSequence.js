import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { getCaseDetailFormWithComputedDatesAction } from '../actions/getCaseDetailFormWithComputedDatesAction';
import { getServeToIrsAlertSuccessAction } from '../actions/StartCaseInternal/getServeToIrsAlertSuccessAction';
import { isPrintPreviewPreparedAction } from '../actions/CourtIssuedOrder/isPrintPreviewPreparedAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { saveCaseDetailInternalEditAction } from '../actions/saveCaseDetailInternalEditAction';
import { serveCaseToIrsAction } from '../actions/StartCaseInternal/serveCaseToIrsAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCaseConfirmationFormDocumentTitleAction } from '../actions/StartCaseInternal/setCaseConfirmationFormDocumentTitleAction';
import { setCaseNotInProgressAction } from '../actions/StartCaseInternal/setCaseNotInProgressAction';
import { setDocumentIdAction } from '../actions/setDocumentIdAction';
import { setPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/setPdfPreviewUrlAction';
import { setPetitionIdAction } from '../actions/setPetitionIdAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const saveCaseAndServeToIrsSequence = [
  clearPdfPreviewUrlAction,
  showProgressSequenceDecorator([
    setCaseNotInProgressAction,
    getCaseDetailFormWithComputedDatesAction,
    saveCaseDetailInternalEditAction,
    setCaseAction,
    setPetitionIdAction,
    setDocumentIdAction,
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
