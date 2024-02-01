import { cloneFile } from '../cloneFile';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';
import fileInput from '../../../../node_modules/@uswds/uswds/packages/usa-file-input/src';

function DragDropInput({
  existingFiles,
  fileInputName,
  handleChange,
  ...remainingProps
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!inputRef.current) return;
    fileInput.on(inputRef.current);
  }, [inputRef]);

  useEffect(() => {
    const multiFileInput = window.document.getElementById(
      'multi-file-input',
    ) as HTMLInputElement;
    if (multiFileInput && existingFiles) {
      const loadFilesFromFormEvent = new Event('change');

      Object.defineProperty(loadFilesFromFormEvent, 'target', {
        value: {
          files: existingFiles,
        },
        writable: false,
      });

      multiFileInput.dispatchEvent(loadFilesFromFormEvent);
    }
  }, []);

  return (
    <input
      {...remainingProps}
      multiple
      accept=".pdf"
      className="usa-file-input"
      id="multi-file-input"
      name={fileInputName}
      ref={inputRef}
      type="file"
      onChange={handleChange}
    />
  );
}

function handleFileSelectionAndValidation(
  e,
  maxFileSize,
  updateFormValueSequence,
) {
  const { name: inputName } = e.target;

  const filesExceedingSizeLimit = Array.from(e.target.files!)
    .map(capturedFile => {
      if (
        capturedFile.size >=
        maxFileSize * 1024 * 1024
        // capturedFile.size >= 5
      ) {
        return capturedFile.name;
      }
    })
    .filter(file => !!file);
  if (filesExceedingSizeLimit.length) {
    alert(
      `Your file(s) size is too big. The maximum file size is ${maxFileSize}MB.
        ${filesExceedingSizeLimit.join(', ')}
        `,
    );
    e.target.value = '';
    return false;
  }

  const clonedFilePromises = Array.from(e.target.files!).map(capturedFile => {
    return cloneFile(capturedFile).catch(() => null);
  });

  Promise.all(clonedFilePromises)
    .then(clonedFiles => {
      const validatedFiles = clonedFiles.filter(file => file !== null);
      updateFormValueSequence({
        key: inputName,
        value: validatedFiles,
      });
    })
    .catch(() => {
      /* no-op */
    });
  // run validationSequence
}

export const FileInput = connect(
  {
    constants: state.constants,
    form: state.form,
    name: props.name,
    updateFormValueSequence: sequences[props.updateFormValueSequence],
    // validationSequence: sequences[props.validationSequence],
  },
  function FileInput({
    constants,
    form,
    name,
    updateFormValueSequence,
    ...remainingProps
    // validationSequence,
  }) {
    return (
      <React.Fragment>
        <DragDropInput
          {...remainingProps}
          existingFiles={form[name]}
          fileInputName={name}
          handleChange={e =>
            handleFileSelectionAndValidation(
              e,
              constants.MAX_FILE_SIZE_MB,
              updateFormValueSequence,
            )
          }
        />
      </React.Fragment>
    );
  },
);

FileInput.displayName = 'FileInput';
