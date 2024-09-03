import { FileValidationResponse } from '@web-client/views/FileHandlingHelpers/fileValidation';
import { applicationContext } from '@web-client/applicationContext';

export const validatePDFUpload = ({
  file,
}: {
  file: File;
}): Promise<FileValidationResponse> => {
  return new Promise(resolve => {
    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);

    fileReader.onload = async () => {
      const { result } = fileReader;

      if (!result || typeof result === 'string') {
        console.error('Failed to read file as ArrayBuffer.');
        resolve({
          errorMessage: 'Failed to read file as ArrayBuffer.',
          isValid: false,
        });
        return;
      }

      const fileAsArrayBuffer = new Uint8Array(result as ArrayBuffer);

      try {
        const pdfjs = await applicationContext.getPdfJs();
        await pdfjs.getDocument(fileAsArrayBuffer).promise;
        resolve({ isValid: true }); // Return true if the PDF is valid
      } catch (err) {
        if (err instanceof Error) {
          if (err.name === 'PasswordException') {
            resolve({
              errorMessage:
                'File is encrypted or password protected. Remove encryption or password protection and try again.',
              isValid: false,
            });
          } else if (err.name === 'InvalidPDFException') {
            resolve({
              errorMessage:
                'File is not a PDF. Select a PDF file or resave the file as a PDF.',
              isValid: false,
            });
          }
        }
        resolve({ errorMessage: 'An unknown error occurred', isValid: false });
      }
    };

    fileReader.onerror = () => {
      resolve({ errorMessage: 'Error reading the file.', isValid: false });
    };
  });
};
