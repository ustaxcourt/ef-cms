import { getFileExternalDocumentAlertSuccessAction } from '../actions/FileDocument/getFileExternalDocumentAlertSuccessAction';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { set } from 'cerebral/factories';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setCurrentPageAction } from '../actions/setCurrentPageAction';
import { state } from 'cerebral';
import { submitCaseAssociationRequestAction } from '../actions/FileDocument/submitCaseAssociationRequestAction';
import { uploadExternalDocumentsAction } from '../actions/FileDocument/uploadExternalDocumentsAction';

export const submitCaseAssociationRequestSequence = [
  setCurrentPageAction('Interstitial'),
  uploadExternalDocumentsAction,
  submitCaseAssociationRequestAction,
  setCaseAction,
  getFileExternalDocumentAlertSuccessAction,
  setAlertSuccessAction,
  set(state.saveAlertsForNavigation, true),
  navigateToCaseDetailAction,
];
