import { clearFormAction } from '../actions/clearFormAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearPdfPreviewUrlAction } from '../actions/CourtIssuedOrder/clearPdfPreviewUrlAction';
import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { computeDateReceivedAction } from '../actions/DocketEntry/computeDateReceivedAction';
import { computeIrsNoticeDateAction } from '../actions/StartCaseInternal/computeIrsNoticeDateAction';
import { computePetitionFeeDatesAction } from '../actions/StartCaseInternal/computePetitionFeeDatesAction';
import { createCaseFromPaperAction } from '../actions/createCaseFromPaperAction';
import { getServeToIrsAlertSuccessAction } from '../actions/StartCaseInternal/getServeToIrsAlertSuccessAction';
import { isPrintPreviewPreparedAction } from '../actions/CourtIssuedOrder/isPrintPreviewPreparedAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
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

export const createCaseFromPaperAndServeToIrsSequence = [
  computeDateReceivedAction,
  computeIrsNoticeDateAction,
  computePetitionFeeDatesAction,
  clearPdfPreviewUrlAction,
  showProgressSequenceDecorator([
    openFileUploadStatusModalAction,
    setCaseNotInProgressAction,
    createCaseFromPaperAction,
    {
      error: [openFileUploadErrorModal],
      success: [
        setCaseAction,
        setPetitionIdAction,
        setDocumentIdAction,
        closeFileUploadStatusModalAction,
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
      ],
    },
  ]),
];
