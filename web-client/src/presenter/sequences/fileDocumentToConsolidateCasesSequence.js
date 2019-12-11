import { gotoFileDocumentSequence } from './gotoFileDocumentSequence';
import { setModalErrorAction } from '../actions/setModalErrorAction';
import { validateFileDocumentAction } from '../actions/caseConsolidation/validateFileDocumentAction';

export const fileDocumentToConsolidateCasesSequence = [
  validateFileDocumentAction,
  {
    error: [setModalErrorAction],
    success: gotoFileDocumentSequence,
  },
];
