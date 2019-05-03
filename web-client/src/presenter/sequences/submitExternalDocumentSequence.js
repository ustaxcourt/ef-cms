import { fileExternalDocumentAction } from '../actions/FileDocument/fileExternalDocumentAction';
import { getFileExternalDocumentAlertSuccessAction } from '../actions/FileDocument/getFileExternalDocumentAlertSuccessAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { set } from 'cerebral/factories';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { state } from 'cerebral';

export const submitExternalDocumentSequence = [
  openFileUploadStatusModalAction,
  fileExternalDocumentAction,
  setCaseAction,
  getFileExternalDocumentAlertSuccessAction,
  setAlertSuccessAction,
  set(state.saveAlertsForNavigation, true),
  navigateToCaseDetailAction,
];
