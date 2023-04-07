import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { getFileExternalDocumentAlertSuccessAction } from '../actions/FileDocument/getFileExternalDocumentAlertSuccessAction';
import { getPrintableFilingReceiptSequence } from './getPrintableFilingReceiptSequence';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { submitRespondentCaseAssociationRequestAction } from '../actions/FileDocument/submitRespondentCaseAssociationRequestAction';
import { uploadExternalDocumentsAction } from '../actions/FileDocument/uploadExternalDocumentsAction';

const onSuccess = [
  // If you file across the consolidated group do you become automatically associated with the cases filed
  // on in the group that you are not currently associated with
  // If they are "Filing First Document in an indirectly associated case accessed through the Consolidated Cases card
  // do we allow to file across the consolidated group?"
  submitRespondentCaseAssociationRequestAction,
  //start looping over CCs at some point after here
  setCaseAction,
  closeFileUploadStatusModalAction,
  getPrintableFilingReceiptSequence,
  getFileExternalDocumentAlertSuccessAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  navigateToCaseDetailAction,
];

export const submitExternalDocumentSequence = showProgressSequenceDecorator([
  openFileUploadStatusModalAction,
  // shouldFileAcrossConsolidatedGroupAction
  // if no continue with preexisting workflow
  uploadExternalDocumentsAction,
  {
    error: [openFileUploadErrorModal],
    success: onSuccess,
  },
  // if yes
  // uploadExternalDocumentsAcrossConsolidatedGroupAction,
  // {
  //   error: [openFileUploadErrorModal],
  //   success: onSuccess,
  // },
]);
