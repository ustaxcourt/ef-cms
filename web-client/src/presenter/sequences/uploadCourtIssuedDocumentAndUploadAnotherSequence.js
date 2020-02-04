import { gotoUploadCourtIssuedDocumentSequence } from './gotoUploadCourtIssuedDocumentSequence';
import { setWaitingForResponseAction } from '../actions/setWaitingForResponseAction';
import { unsetWaitingForResponseAction } from '../actions/unsetWaitingForResponseAction';
import { uploadCourtIssuedDocument } from './uploadCourtIssuedDocumentSequence';

export const uploadCourtIssuedDocumentAndUploadAnotherSequence = [
  setWaitingForResponseAction,
  uploadCourtIssuedDocument(gotoUploadCourtIssuedDocumentSequence),
  unsetWaitingForResponseAction,
];
