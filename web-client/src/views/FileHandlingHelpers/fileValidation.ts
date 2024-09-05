import { validatePDFUpload } from '@web-client/views/FileHandlingHelpers/pdfValidation';

export interface FileValidationResponse {
  isValid: boolean;
  errorMessage?: string;
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
    return `File is not ${displayName}. Select ${displayName} file or resave the file as ${displayName}.`;
  }
  return `File is not in a supported format (${fileExtensions.join(', ')}). Select a different file or resave it in a supported format.`;
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
  e: any;
  megabyteLimit: number;
  onSuccess: () => void;
  onError: ({
    errorToLog,
    message,
    title,
  }: {
    errorToLog: string;
    message: string;
    title: string;
  }) => void;
}) => {
  const selectedFile = e.target.files[0];
  const { errorMessage, isValid } = await validateFile({
    allowedFileExtensions,
    file: selectedFile,
    megabyteLimit,
  });
  if (!isValid) {
    onError({
      errorToLog: errorMessage!,
      message: errorMessage!,
      title: 'File Upload Error',
    });
    e.target.value = null;
    return;
  }
  onSuccess();
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
  console.log(file);
  if (file.size > megabyteLimit * 1024 * 1024) {
    return {
      errorMessage: `Your file size is too big. The maximum file size is ${megabyteLimit}MB.`,
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
    return await validatePDFUpload({ file });
  }
  return { isValid: true };
};
