import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FileInput } from '../FileDocument/FileInput';
import { connect } from '../../presenter/shared.cerebral';
import { genericOnValidationErrorHandler } from '@web-client/views/FileHandlingHelpers/fileValidation';
import { props as cerebralProps } from 'cerebral';
import { sequences, state } from '../../presenter/app.cerebral';
import React from 'react';

const props = cerebralProps as unknown as {
  documentType: string;
  validateSequence?: () => void;
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
  validateSequence?: () => void;
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
    const handleFileChange = async (file: File) => {
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
      } finally {
        setIsNotLoadingSequence();
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
          <span className="usa-hint">
            File must be in PDF format (.pdf). Max file size{' '}
            {constants.MAX_FILE_SIZE_MB}MB.
          </span>
          <FileInput
            accept=".pdf"
            aria-describedby={`${documentType}-hint`}
            data-testid={documentType}
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
