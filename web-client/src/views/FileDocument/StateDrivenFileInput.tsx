import { FileInput } from './FileInput';
import { cloneFile } from '../FileHandlingHelpers/cloneFile';
import { connect } from '../../presenter/shared.cerebral';
import { genericOnValidationErrorHandler } from '../FileHandlingHelpers/fileValidation';
import { props as cerebralProps } from 'cerebral';
import { sequences } from '../../presenter/app.cerebral';
import { state } from '../../presenter/app.cerebral';
import React from 'react';

type StateDriveFileInputProps = {
  'aria-describedby': string;
  file?: File;
  id: string;
  updateFormValueSequence: string;
  validationSequence?: string;
  name: string;
  accept?: string;
  ignoreSizeKey?: boolean;
  skipFileTypeValidation?: boolean;
};

const props = cerebralProps as unknown as {
  updateFormValueSequence: string;
  validationSequence?: string;
};

const deps = {
  constants: state.constants,
  form: state.form,
  setIsLoadingSequence: sequences.setIsLoadingSequence,
  setIsNotLoadingSequence: sequences.setIsNotLoadingSequence,
  showFileUploadErrorModalSequence: sequences.showFileUploadErrorModalSequence,
  updateFormValueSequence: sequences[props.updateFormValueSequence],
  validationSequence: props.validationSequence
    ? sequences[props.validationSequence]
    : undefined,
};

export const StateDrivenFileInput = connect<
  StateDriveFileInputProps,
  typeof deps
>(
  deps,
  function StateDrivenFileInput({
    accept = '.pdf',
    'aria-describedby': ariaDescribedBy,
    constants,
    file,
    form,
    id,
    ignoreSizeKey,
    name: fileInputName,
    setIsLoadingSequence,
    setIsNotLoadingSequence,
    showFileUploadErrorModalSequence,
    skipFileTypeValidation = false,
    updateFormValueSequence,
    validationSequence,
    ...remainingProps
  }) {
    const fileOnForm = file || form[fileInputName];
    const { existingFileName } = form;

    const handleFileChange = async (selectedFile: File) => {
      setIsLoadingSequence();
      try {
        const clonedFile = await cloneFile(selectedFile);
        updateFormValueSequence({
          key: fileInputName,
          property: 'file',
          value: clonedFile,
        });
        updateFormValueSequence({
          key: ignoreSizeKey ? fileInputName : `${fileInputName}Size`,
          property: 'size',
          value: clonedFile.size,
        });
        if (validationSequence) {
          await validationSequence();
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

    const handleRemoveFile = () => {
      updateFormValueSequence({
        key: fileInputName,
        property: 'file',
        value: null,
      });
      updateFormValueSequence({
        key: 'existingFileName',
        value: null,
      });
      updateFormValueSequence({
        key: ignoreSizeKey ? fileInputName : `${fileInputName}Size`,
        property: 'size',
        value: null,
      });
    };

    return (
      <FileInput
        {...remainingProps}
        accept={accept}
        aria-describedby={ariaDescribedBy}
        data-testid={id}
        existingFileName={existingFileName}
        file={fileOnForm}
        id={id}
        maxFileSizeMB={constants.MAX_FILE_SIZE_MB}
        name={fileInputName}
        onError={handleError}
        onFileChange={handleFileChange}
        onRemoveFile={handleRemoveFile}
        skipFileTypeValidation={skipFileTypeValidation}
      />
    );
  },
);
