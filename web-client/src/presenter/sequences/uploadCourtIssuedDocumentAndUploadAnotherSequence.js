import { gotoUploadCourtIssuedDocumentSequence } from './gotoUploadCourtIssuedDocumentSequence';
import { uploadCourtIssuedDocument } from './uploadCourtIssuedDocumentSequence';

export const uploadCourtIssuedDocumentAndUploadAnotherSequence = [
  uploadCourtIssuedDocument(gotoUploadCourtIssuedDocumentSequence),
];
