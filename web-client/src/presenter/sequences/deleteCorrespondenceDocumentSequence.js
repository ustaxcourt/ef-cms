import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { deleteCorrespondenceDocumentAction } from '../actions/CorrespondenceDocument/deleteCorrespondenceDocumentAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getDeleteCorrespondenceDocumentAlertErrorAction } from '../actions/CorrespondenceDocument/getDeleteCorrespondenceDocumentAlertErrorAction';
import { getDeleteCorrespondenceDocumentAlertSuccessAction } from '../actions/CorrespondenceDocument/getDeleteCorrespondenceDocumentAlertSuccessAction';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';

export const deleteCorrespondenceDocumentSequence = [
  deleteCorrespondenceDocumentAction,
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
    ],
  },
  clearModalAction,
  clearModalStateAction,
];
