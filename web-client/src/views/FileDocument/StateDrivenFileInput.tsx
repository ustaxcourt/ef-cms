import { FileInput } from './FileInput';
import { cloneFile } from '../FileHandlingHelpers/cloneFile';
import { connect } from '../../presenter/shared.cerebral';
import {
  genericOnValidationErrorHandler,
  validateFileOnSelect,
} from '../FileHandlingHelpers/fileValidation';
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
    const fileOnForm = file || form[fileInputName] || form.existingFileName;
    const { existingFileName } = form;

    const onFileSelectionChange = async (
      fileOrEvent: File | React.ChangeEvent<HTMLInputElement>,
    ) => {
      const e = fileOrEvent as React.ChangeEvent<HTMLInputElement>;
      setIsLoadingSequence();
      await validateFileOnSelect({
        allowedFileExtensions: accept.split(','),
        e,
        megabyteLimit: constants.MAX_FILE_SIZE_MB,
        onError: ({ errorType, messageToDisplay, messageToLog }) => {
          genericOnValidationErrorHandler({
            errorType,
            messageToDisplay,
            messageToLog,
            showFileUploadErrorModalSequence,
          });
        },
        onSuccess: ({ selectedFile }) => {
          const { name: inputName } = e.target;
          cloneFile(selectedFile!)
            .then(clonedFile => {
              updateFormValueSequence({
                key: inputName,
                property: 'file',
                value: clonedFile,
              });
              updateFormValueSequence({
                key: ignoreSizeKey ? inputName : `${inputName}Size`,
                property: 'size',
                value: clonedFile.size,
              });
              return validationSequence ? validationSequence() : null;
            })
            .catch(() => {
              /* no-op */
            });
        },
        skipFileTypeValidation,
      });
      setIsNotLoadingSequence();
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
        onFileChange={onFileSelectionChange}
        onRemoveFile={handleRemoveFile}
        skipFileTypeValidation={skipFileTypeValidation}
        useExternalValidation={true}
      />
    );
  },
);
