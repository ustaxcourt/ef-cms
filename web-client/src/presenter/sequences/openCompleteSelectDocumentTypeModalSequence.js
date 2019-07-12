import { clearModalStateAction } from '../actions/clearModalStateAction';
import { defaultSecondaryDocumentAction } from '../actions/FileDocument/defaultSecondaryDocumentAction';
import { generateTitleAction } from '../actions/FileDocument/generateTitleAction';
import { navigateToFileADocumentAction } from '../actions/FileDocument/navigateToFileADocumentAction';
import { set } from 'cerebral/factories';
import { setDefaultPartySelectionAction } from '../actions/FileDocument/setDefaultPartySelectionAction';
import { setDocketNumberPropAction } from '../actions/FileDocument/setDocketNumberPropAction';
import { state } from 'cerebral';
import { validateSelectDocumentTypeAction } from '../actions/validateSelectDocumentTypeAction';

export const openCompleteSelectDocumentTypeModalSequence = [
  clearModalStateAction,
  defaultSecondaryDocumentAction,
  validateSelectDocumentTypeAction,
  {
    error: [set(state.showModal, 'CompleteSelectDocumentModalDialog')],
    success: [
      generateTitleAction,
      setDocketNumberPropAction,
      setDefaultPartySelectionAction,
      navigateToFileADocumentAction,
    ],
  },
];
