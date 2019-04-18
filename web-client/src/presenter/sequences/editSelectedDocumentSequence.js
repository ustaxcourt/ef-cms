import { clearDocumentScenarioAction } from '../actions/FileDocument/clearDocumentScenarioAction';
import { clearSecondaryDocumentFormAction } from '../actions/FileDocument/clearSecondaryDocumentFormAction';
import { set } from 'cerebral/factories';
import { state } from 'cerebral';

export const editSelectedDocumentSequence = [
  set(state.screenMetadata.isDocumentTypeSelected, false),
  clearDocumentScenarioAction,
  clearSecondaryDocumentFormAction,
];
