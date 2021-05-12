import { archiveCorrespondenceDocumentAction } from '../actions/CorrespondenceDocument/archiveCorrespondenceDocumentAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getDeleteCorrespondenceDocumentAlertErrorAction } from '../actions/CorrespondenceDocument/getDeleteCorrespondenceDocumentAlertErrorAction';
import { getDeleteCorrespondenceDocumentAlertSuccessAction } from '../actions/CorrespondenceDocument/getDeleteCorrespondenceDocumentAlertSuccessAction';
import { getMessagesForCaseAction } from '../actions/CaseDetail/getMessagesForCaseAction';
import { loadDefaultViewerCorrespondenceSequence } from './loadDefaultViewerCorrespondenceSequence';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { showProgressSequenceDecorator } from '../utilities/sequenceHelpers';

export const deleteCorrespondenceDocumentSequence =
  showProgressSequenceDecorator([
    archiveCorrespondenceDocumentAction,
    {
      error: [
        getDeleteCorrespondenceDocumentAlertErrorAction,
        setAlertErrorAction,
      ],
      success: [
        getDeleteCorrespondenceDocumentAlertSuccessAction,
        setAlertSuccessAction,
        getCaseAction,
        setCaseAction,
        getMessagesForCaseAction,
        ...loadDefaultViewerCorrespondenceSequence,
      ],
    },
    clearModalAction,
    clearModalStateAction,
  ]);
