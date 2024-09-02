import { validatePDFUpload } from '@web-client/views/FileHandlingHelpers/pdfValidation';

export interface FileValidationResponse {
  isValid: boolean;
  errorMessage?: string;
}

export const validateFile = async ({
  file,
  megabyteLimit,
}: {
  file: File;
  megabyteLimit: number;
}): Promise<FileValidationResponse> => {
  if (file.size > megabyteLimit * 1024 * 1024) {
    return {
      errorMessage: `Your file size is too big. The maximum file size is ${megabyteLimit}MB.`,
      isValid: false,
    };
  }
  if (file.type === 'application/pdf') {
    return await validatePDFUpload({ file });
  }
  return { isValid: true };
};
