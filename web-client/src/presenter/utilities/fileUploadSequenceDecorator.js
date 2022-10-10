import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { uploadDocketEntryFileAction } from '../actions/DocketEntry/uploadDocketEntryFileAction';
import { validateUploadedPdfAction } from '../actions/CourtIssuedDocketEntry/validateUploadedPdfAction';

export const fileUploadSequenceDecorator = actionsList => {
  return [
    openFileUploadStatusModalAction,
    uploadDocketEntryFileAction,
    {
      error: [openFileUploadErrorModal],
      success: [validateUploadedPdfAction, ...actionsList],
    },
  ];
};
