import { clearModalStateAction } from '../actions/clearModalStateAction';
import { defaultSecondaryDocumentAction } from '../actions/FileDocument/defaultSecondaryDocumentAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { navigateToFileADocumentAction } from '../actions/FileDocument/navigateToFileADocumentAction';
import { setDefaultFileDocumentFormValuesAction } from '../actions/FileDocument/setDefaultFileDocumentFormValuesAction';
import { setDocketNumberPropAction } from '../actions/FileDocument/setDocketNumberPropAction';
import { setShowModalFactoryAction } from '../actions/setShowModalFactoryAction';
import { validateSelectDocumentTypeAction } from '../actions/validateSelectDocumentTypeAction';

export const openCompleteSelectDocumentTypeModalSequence = [
  clearModalStateAction,
  defaultSecondaryDocumentAction,
  validateSelectDocumentTypeAction,
  {
    error: [setShowModalFactoryAction('CompleteSelectDocumentModalDialog')],
    success: [
      generateTitleAction,
      setDocketNumberPropAction,
      setDefaultFileDocumentFormValuesAction,
      navigateToFileADocumentAction,
    ],
  },
];
