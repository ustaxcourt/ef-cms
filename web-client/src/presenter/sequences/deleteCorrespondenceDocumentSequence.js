import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deleteCorrespondenceDocumentAction } from '../actions/CorrespondenceDocument/deleteCorrespondenceDocumentAction';
import { getCaseAction } from '../actions/getCaseAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setCaseAction } from '../actions/setCaseAction';

export const deleteCorrespondenceDocumentSequence = [
  deleteCorrespondenceDocumentAction,
  {
    error: [setAlertErrorAction],
    success: [getCaseAction, setCaseAction],
  },
  clearModalAction,
  clearModalStateAction,
];
