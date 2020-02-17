import { clearModalAction } from '../actions/clearModalAction';
import { clearModalStateAction } from '../actions/clearModalStateAction';
import { setModalErrorAction } from '../actions/setModalErrorAction';
import { setSelectedCasesForConsolidatedCaseDocumentSubmissionAction } from '../actions/FileDocument/setSelectedCasesForConsolidatedCaseDocumentSubmissionAction';
import { validateFileExternalDocumentAction } from '../actions/FileDocument/validateFileExternalDocumentAction';

export const setSelectedCasesForConsolidatedCaseDocumentSubmissionSequence = [
  validateFileExternalDocumentAction,
  {
    error: [setModalErrorAction],
    success: [
      setSelectedCasesForConsolidatedCaseDocumentSubmissionAction,
      clearModalAction,
      clearModalStateAction,
    ],
  },
];
