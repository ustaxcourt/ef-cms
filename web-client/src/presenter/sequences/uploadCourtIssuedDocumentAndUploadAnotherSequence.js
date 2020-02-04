import { getUploadCourtIssuedDocumentAndUploadAnotherAlertSuccessAction } from '../actions/uploadCourtIssuedDocument/getUploadCourtIssuedDocumentAndUploadAnotherAlertSuccessAction';
import { gotoUploadCourtIssuedDocumentSequence } from './gotoUploadCourtIssuedDocumentSequence';
import { uploadCourtIssuedDocument } from './uploadCourtIssuedDocumentSequence';

export const uploadCourtIssuedDocumentAndUploadAnotherSequence = [
  uploadCourtIssuedDocument({
    completeAction: gotoUploadCourtIssuedDocumentSequence,
    getAlertSuccessAction: getUploadCourtIssuedDocumentAndUploadAnotherAlertSuccessAction,
  }),
];
