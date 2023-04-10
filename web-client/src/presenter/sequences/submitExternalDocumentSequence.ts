import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { getConsolidatedCasesByCaseAction } from '../actions/CaseConsolidation/getConsolidatedCasesByCaseAction';
import { getFileExternalDocumentAlertSuccessAction } from '../actions/FileDocument/getFileExternalDocumentAlertSuccessAction';
import { getPrintableFilingReceiptSequence } from './getPrintableFilingReceiptSequence';
import { navigateToCaseDetailAction } from '../actions/navigateToCaseDetailAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { setAlertSuccessAction } from '../actions/setAlertSuccessAction';
import { setCaseAction } from '../actions/setCaseAction';
import { setConsolidatedCasesForCaseAction } from '../actions/CaseConsolidation/setConsolidatedCasesForCaseAction';
import { setSaveAlertsForNavigationAction } from '../actions/setSaveAlertsForNavigationAction';
import { shouldFileAcrossConsolidatedGroupAction } from '../actions/CaseConsolidation/shouldFileAcrossConsolidatedGroupAction';
import { showProgressSequenceDecorator } from '../utilities/showProgressSequenceDecorator';
import { submitRespondentCaseAssociationRequestAction } from '../actions/FileDocument/submitRespondentCaseAssociationRequestAction';
import { uploadExternalDocumentsAction } from '../actions/FileDocument/uploadExternalDocumentsAction';

const onSuccess = [
  // If you file across the consolidated group do you become automatically associated with the cases filed
  // on in the group that you are not currently associated with
  // If they are "Filing First Document in an indirectly associated case accessed through the Consolidated Cases card
  // do we allow to file across the consolidated group?"
  //start looping over CCs at some point after here
  // shouldFileAcrossConsolidatedGroupAction,
  // {
  //   no: [
  submitRespondentCaseAssociationRequestAction,
  setCaseAction,
  closeFileUploadStatusModalAction,
  getPrintableFilingReceiptSequence,
  getFileExternalDocumentAlertSuccessAction,
  setAlertSuccessAction,
  setSaveAlertsForNavigationAction,
  navigateToCaseDetailAction,
  //   ],
  //   yes: [getConsolidatedCasesByCaseAction, setConsolidatedCasesForCaseAction],
  // },
];

export const submitExternalDocumentSequence = showProgressSequenceDecorator([
  openFileUploadStatusModalAction,
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
