import { archiveDraftDocumentAction } from '../actions/archiveDraftDocumentAction';
import { clearDraftDocumentViewerAction } from '../actions/clearDraftDocumentViewerAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getMessagesForCaseAction } from '../actions/CaseDetail/getMessagesForCaseAction';
import { loadDefaultDraftViewerDocumentToDisplaySequence } from './DocketEntry/loadDefaultDraftViewerDocumentToDisplaySequence';
import { resetArchiveDraftDocumentAction } from '../actions/resetArchiveDraftDocumentAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const archiveDraftDocumentSequence = showProgressSequenceDecorator([
  clearModalAction,
  clearDraftDocumentViewerAction,
  archiveDraftDocumentAction,
  {
    error: [setShowModalFactoryAction('DocketEntryHasAlreadyBeenServedModal')],
    success: [
      setSaveAlertsForNavigationAction,
      setAlertSuccessAction,
      getCaseAction,
      getMessagesForCaseAction,
      resetArchiveDraftDocumentAction,
      loadDefaultDraftViewerDocumentToDisplaySequence,
    ],
  },
]);
