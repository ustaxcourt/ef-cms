import { archiveDraftDocumentAction } from '../actions/archiveDraftDocumentAction';
import { clearDraftDocumentViewerAction } from '../actions/clearDraftDocumentViewerAction';
import { clearModalAction } from '../actions/clearModalAction';
import { getDefaultDraftViewerDocumentToDisplayAction } from '../actions/getDefaultDraftViewerDocumentToDisplayAction';
import { getMessagesForCaseAction } from '../actions/CaseDetail/getMessagesForCaseAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { resetArchiveDraftDocumentAction } from '../actions/resetArchiveDraftDocumentAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { setViewerDraftDocumentToDisplayAction } from '../actions/setViewerDraftDocumentToDisplayAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

export const archiveDraftDocumentSequence = showProgressSequenceDecorator([
  clearModalAction,
  clearDraftDocumentViewerAction,
  archiveDraftDocumentAction,
  {
    error: [setShowModalFactoryAction('DocketEntryHasAlreadyBeenServedModal')],
    success: [
      setCaseAction,
      resetArchiveDraftDocumentAction,
      getDefaultDraftViewerDocumentToDisplayAction,
      setViewerDraftDocumentToDisplayAction,
      getMessagesForCaseAction,
      navigateToCaseDetailAction,
    ],
  },
]);
