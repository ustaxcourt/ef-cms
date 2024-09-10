import { validatePdf } from '@web-client/views/FileHandlingHelpers/pdfValidation';
import React from 'react';

export enum ErrorTypes {
  WRONG_FILE_TYPE = 'WRONG_FILE_TYPE',
  FILE_TOO_BIG = 'FILE_TOO_BIG',
  CORRUPT_FILE = 'CORRUPT_FILE',
  ENCRYPTED_FILE = 'ENCRYPTED_FILE',
  UNKNOWN = 'UNKNOWN',
}

export interface FileValidationResponse {
  isValid: boolean;
  errorMessage?: string;
  errorType?: ErrorTypes;
}

function getFileExtension(filename: string) {
  // Shift to avoid -1 - 1 = -2 in the case of no period
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 1);
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

const validateCorrectFileType = ({
  allowedFileExtensions,
  file,
}: {
  file: File;
  allowedFileExtensions: string[];
}) => {
  if (!allowedFileExtensions.includes(getFileExtension(file.name))) {
    return {
      errorMessage: getWrongFileTypeMessage(allowedFileExtensions),
      errorType: ErrorTypes.WRONG_FILE_TYPE,
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
}: {
  allowedFileExtensions: string[];
  e: React.ChangeEvent<HTMLInputElement>;
  megabyteLimit: number;
  onSuccess: ({ selectedFile }: { selectedFile: File }) => void;
  onError: ({
    errorType,
    message,
  }: {
    message: string;
    errorType?: ErrorTypes;
  }) => void;
}) => {
  const target = e.target as HTMLInputElement;

  if (!target || !target.files || target.files.length === 0) {
    onError({
      message: 'No file selected',
    });
    return;
  }

  const selectedFile = target.files[0];
  const { errorMessage, errorType, isValid } = await validateFile({
    allowedFileExtensions,
    file: selectedFile,
    megabyteLimit,
  });
  if (!isValid) {
    onError({
      errorType,
      message: errorMessage!,
    });
    target.value = '';
    return;
  }
  onSuccess({ selectedFile });
};

export const validateFile = async ({
  allowedFileExtensions,
  file,
  megabyteLimit,
}: {
  file: File;
  megabyteLimit: number;
  allowedFileExtensions: string[];
}): Promise<FileValidationResponse> => {
  if (file.size > megabyteLimit * 1024 * 1024) {
    return {
      errorMessage: `The file size is too big. The maximum file size is ${megabyteLimit}MB. Reduce the file size and try again.`,
      errorType: ErrorTypes.FILE_TOO_BIG,
      isValid: false,
    };
  }
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
  return { isValid: true };
};
