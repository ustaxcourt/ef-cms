import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FileInput } from '../FileDocument/FileInput';
import { connect } from '@web-client/presenter/shared.cerebral';
import { genericOnValidationErrorHandler } from '@web-client/views/FileHandlingHelpers/fileValidation';
import { props as cerebralProps } from 'cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const props = cerebralProps as unknown as {
  documentType: string;
  validateSequence?: Function;
};

const dependencies = {
  constants: state.constants,
  documentType: props.documentType,
  setIsLoadingSequence: sequences.setIsLoadingSequence,
  setIsNotLoadingSequence: sequences.setIsNotLoadingSequence,
  setDocumentForUploadSequence: sequences.setDocumentForUploadSequence,
  showFileUploadErrorModalSequence: sequences.showFileUploadErrorModalSequence,
  validateSequence: props.validateSequence,
};

type ScanBatchFileInputProps = {
  documentType: string;
  validateSequence?: Function;
};

export const ScanBatchFileInput = connect<
  ScanBatchFileInputProps,
  typeof dependencies
>(
  dependencies,
  function ScanBatchFileInput({
    constants,
    documentType,
    setIsLoadingSequence,
    setIsNotLoadingSequence,
    setDocumentForUploadSequence,
    showFileUploadErrorModalSequence,
    validateSequence,
  }) {
    const handleFileChange = async (
      fileOrEvent: File | React.ChangeEvent<HTMLInputElement>,
    ) => {
      const file = fileOrEvent as File;

      setIsLoadingSequence();
      try {
        setDocumentForUploadSequence({
          documentType,
          documentUploadMode: 'preview',
          file,
        });
        if (validateSequence) {
          await validateSequence();
        }
        setIsNotLoadingSequence();
      } catch (error: any) {
        const errorMessage =
          error?.message ||
          error?.toString() ||
          'Failed to process file. Please try again.';
        handleError({
          messageToDisplay: errorMessage,
          messageToLog: errorMessage,
        });
      }
    };

    const handleError = ({
      errorType,
      messageToDisplay,
      messageToLog,
    }: {
      errorType?: any;
      messageToDisplay: string;
      messageToLog?: string;
    }) => {
      setIsNotLoadingSequence();
      genericOnValidationErrorHandler({
        errorType,
        messageToDisplay,
        messageToLog,
        showFileUploadErrorModalSequence,
      });
    };

    return (
      <div className="document-detail-one-third">
        <FormGroup>
          <label
            className="usa-label ustc-upload-stin with-hint"
            data-testid={`${documentType}-label`}
            htmlFor={`${documentType}-file`}
            id={`${documentType}-label`}
          >
            Upload your file{' '}
            <span className="success-message">
              <FontAwesomeIcon icon="check-circle" size="1x" />
            </span>
          </label>
          <span className="usa-hint" id={`${documentType}-hint`}>
            File must be in PDF format (.pdf). Max file size{' '}
            {constants.MAX_FILE_SIZE_MB}MB.
          </span>
          <FileInput
            accept=".pdf"
            aria-describedby={`${documentType}-hint`}
            data-testid={`${documentType}-file-input`}
            id={`${documentType}-file`}
            maxFileSizeMB={constants.MAX_FILE_SIZE_MB}
            name={documentType}
            onError={handleError}
            onFileChange={handleFileChange}
            showFileInfo={false}
          />
        </FormGroup>
      </div>
    );
  },
);

ScanBatchFileInput.displayName = 'ScanBatchFileInput';
