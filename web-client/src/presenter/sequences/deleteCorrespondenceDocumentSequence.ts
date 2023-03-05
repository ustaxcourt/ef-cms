import { archiveCorrespondenceDocumentAction } from '../actions/CorrespondenceDocument/archiveCorrespondenceDocumentAction';
import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { getCaseAction } from '../actions/getCaseAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { getDeleteCorrespondenceDocumentAlertErrorAction } from '../actions/CorrespondenceDocument/getDeleteCorrespondenceDocumentAlertErrorAction';
import { getDeleteCorrespondenceDocumentAlertSuccessAction } from '../actions/CorrespondenceDocument/getDeleteCorrespondenceDocumentAlertSuccessAction';
import { getMessagesForCaseAction } from '../actions/CaseDetail/getMessagesForCaseAction';
import { loadDefaultViewerCorrespondenceSequence } from './loadDefaultViewerCorrespondenceSequence';
import { setAlertErrorAction } from '../actions/setAlertErrorAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';

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
        getConsolidatedCasesByCaseAction,
        setConsolidatedCasesForCaseAction,
        getMessagesForCaseAction,
        ...loadDefaultViewerCorrespondenceSequence,
      ],
    },
    clearModalAction,
    clearModalStateAction,
  ]);
