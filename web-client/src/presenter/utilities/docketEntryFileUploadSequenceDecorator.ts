import { closeFileUploadStatusModalAction } from '../actions/closeFileUploadStatusModalAction';
import { openFileUploadErrorModal } from '../actions/openFileUploadErrorModal';
import { openFileUploadStatusModalAction } from '../actions/openFileUploadStatusModalAction';
import { setProgressForFileUploadAction } from '../actions/setProgressForFileUploadAction';
import { setupFilesForCaseCreationAction } from '../actions/CaseCreation/setupFilesForCaseCreationAction';
import { uploadDocketEntryFileAction } from '../actions/DocketEntry/uploadDocketEntryFileAction';
import { validateUploadedPdfAction } from '../actions/CourtIssuedDocketEntry/validateUploadedPdfAction';

export const docketEntryFileUploadSequenceDecorator = actionsList => {
  return [
    openFileUploadStatusModalAction,
    setupFilesForCaseCreationAction,
    setProgressForFileUploadAction,
    uploadDocketEntryFileAction,
    {
      error: [openFileUploadErrorModal],
      success: [
        validateUploadedPdfAction,
        ...actionsList,
        closeFileUploadStatusModalAction,
      ],
    },
  ];
};
