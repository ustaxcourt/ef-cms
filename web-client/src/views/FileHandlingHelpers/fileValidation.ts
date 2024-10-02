import { TROUBLESHOOTING_INFO } from '@shared/business/entities/EntityConstants';
import { TroubleshootingLinkInfo } from '@web-client/presenter/sequences/showFileUploadErrorModalSequence';
import { validatePdf } from '@web-client/views/FileHandlingHelpers/pdfValidation';
import React from 'react';

export enum ErrorTypes {
  WRONG_FILE_TYPE = 'WRONG_FILE_TYPE',
  FILE_TOO_BIG = 'FILE_TOO_BIG',
  CORRUPT_FILE = 'CORRUPT_FILE',
  ENCRYPTED_FILE = 'ENCRYPTED_FILE',
  UNKNOWN = 'UNKNOWN',
}

interface FileValidationErrorInfo {
  errorType: ErrorTypes;
  errorMessageToDisplay: string;
  errorMessageToLog?: string; // Decouple this from the display so we can send finer-grained errors to our logging as needed
}

export interface FileValidationResponse {
  isValid: boolean;
  errorInformation?: FileValidationErrorInfo;
}

function getFileExtension(filename: string) {
  // Shift to avoid -1 - 1 = -2 in the case of no period
  return filename
    .slice(((filename.lastIndexOf('.') - 1) >>> 0) + 1)
    .toLowerCase();
}

// Including the article to avoid worrying about a/an logic
const fileExtensionDisplayNames = {
  '.doc': 'a Word Document',
  '.docx': 'a Word Document',
  '.jpeg': 'a JPEG Image',
  '.jpg': 'a JPEG Image',
  '.pdf': 'a PDF',
  '.png': 'a PNG Image',
};

const getDisplayNameForFileExtension = (fileExtension: string) => {
  if (Object.keys(fileExtensionDisplayNames).includes(fileExtension)) {
    return fileExtensionDisplayNames[fileExtension];
  }
  return fileExtension;
};

const getWrongFileTypeMessage = (fileExtensions: string[]) => {
  if (fileExtensions.length === 1) {
    const displayName = getDisplayNameForFileExtension(fileExtensions[0]);
    return `The file is not ${displayName}. Select ${displayName} file or resave the file as ${displayName}.`;
  }
  return `The file is not in a supported format (${fileExtensions.join(', ')}). Select a different file or resave it in a supported format.`;
};

export const validateFileSize = ({
  file,
  megabyteLimit,
}: {
  file: File;
  megabyteLimit: number;
}): FileValidationResponse => {
  if (file.size > megabyteLimit * 1024 * 1024) {
    return {
      errorInformation: {
        errorMessageToDisplay: `The file size is too big. The maximum file size is ${megabyteLimit}MB. Reduce the file size and try again.`,
        errorType: ErrorTypes.FILE_TOO_BIG,
      },
      isValid: false,
    };
  }
  return { isValid: true };
};

const validateCorrectFileType = ({
  allowedFileExtensions,
  file,
}: {
  file: File;
  allowedFileExtensions: string[];
}): FileValidationResponse => {
  if (!allowedFileExtensions.includes(getFileExtension(file.name))) {
    return {
      errorInformation: {
        errorMessageToDisplay: getWrongFileTypeMessage(allowedFileExtensions),
        errorType: ErrorTypes.WRONG_FILE_TYPE,
      },
      isValid: false,
    };
  }
  return { isValid: true };
};

export const validateFileOnSelect = async ({
  allowedFileExtensions,
  e,
  megabyteLimit,
  onError,
  onSuccess,
  skipFileTypeValidation = false,
}: {
  allowedFileExtensions: string[];
  e: React.ChangeEvent<HTMLInputElement>;
  megabyteLimit: number;
  onSuccess: ({ selectedFile }: { selectedFile: File }) => void;
  onError: ({
    errorType,
    messageToDisplay,
    messageToLog,
  }: {
    messageToDisplay: string;
    errorType?: ErrorTypes;
    messageToLog?: string;
  }) => void;
  skipFileTypeValidation?: boolean;
}) => {
  const target = e.target as HTMLInputElement;

  if (!target || !target.files || target.files.length === 0) {
    onError({
      messageToDisplay: 'No file selected. Please upload a file.',
    });
    return;
  }

  const selectedFile = target.files[0];
  const { errorInformation, isValid } = await validateFile({
    allowedFileExtensions,
    file: selectedFile,
    megabyteLimit,
    skipFileTypeValidation,
  });
  if (!isValid) {
    onError({
      errorType: errorInformation?.errorType,
      messageToDisplay: errorInformation?.errorMessageToDisplay!,
      messageToLog: errorInformation?.errorMessageToLog,
    });
    target.value = ''; // Deselect the file
    return;
  }
  onSuccess({ selectedFile });
};

export const validateFile = async ({
  allowedFileExtensions,
  file,
  megabyteLimit,
  skipFileTypeValidation = false,
}: {
  file: File;
  megabyteLimit: number;
  allowedFileExtensions: string[];
  skipFileTypeValidation?: boolean;
}): Promise<FileValidationResponse> => {
  const fileSizeValidation = validateFileSize({ file, megabyteLimit });
  if (!fileSizeValidation.isValid) {
    return fileSizeValidation;
  }

  if (!skipFileTypeValidation) {
    const correctFileValidation = validateCorrectFileType({
      allowedFileExtensions,
      file,
    });
    if (!correctFileValidation.isValid) {
      return correctFileValidation;
    }
    if (file.type === 'application/pdf') {
      return await validatePdf({ file });
    }
  }

  return { isValid: true };
};

export const genericOnValidationErrorHandler = ({
  errorType,
  messageToDisplay,
  messageToLog,
  showFileUploadErrorModalSequence,
}: {
  errorType?: ErrorTypes;
  messageToDisplay: string;
  messageToLog?: string;
  showFileUploadErrorModalSequence: ({
    contactSupportMessage,
    errorToLog,
    message,
    title,
    troubleshootingInfo,
  }: {
    contactSupportMessage: string;
    errorToLog?: string;
    message: string;
    title: string;
    troubleshootingInfo?: TroubleshootingLinkInfo;
  }) => void;
}) => {
  showFileUploadErrorModalSequence({
    contactSupportMessage:
      'If you still have a problem uploading the file, email',
    errorToLog: messageToLog || messageToDisplay,
    message: messageToDisplay,
    title: 'There Is a Problem With This File',
    troubleshootingInfo:
      errorType && errorType !== ErrorTypes.WRONG_FILE_TYPE
        ? {
            linkMessage: 'Learn about troubleshooting files',
            linkUrl: TROUBLESHOOTING_INFO.FILE_UPLOAD_TROUBLESHOOTING_LINK,
          }
        : undefined,
  });
};
