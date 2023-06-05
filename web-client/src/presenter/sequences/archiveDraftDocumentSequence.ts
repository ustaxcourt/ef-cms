import { archiveDraftDocumentAction } from '../actions/archiveDraftDocumentAction';
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
  archiveDraftDocumentAction,
  {
    error: [({ props }) => setShowModalFactoryAction(props.showModal)],
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
