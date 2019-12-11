import { gotoFileDocumentSequence } from './gotoFileDocumentSequence';
import { setModalErrorAction } from '../actions/setModalErrorAction';
import { validateFileDocumentAction } from '../actions/FileDocument/validateFileExternalDocumentAction';

export const fileExternalDocumentToConsolidatedCasesSequence = [
  validateFileDocumentAction,
  {
    error: [setModalErrorAction],
    success: gotoFileDocumentSequence,
  },
];
