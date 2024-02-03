import { cloneFile } from '../cloneFile';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';
import fileInput from '../../../../node_modules/@uswds/uswds/packages/usa-file-input/src';

const forceLoadFiles = (fileInputElement, files) => {
  const loadFiles = new Event('change');
  Object.defineProperty(loadFiles, 'target', {
    value: {
      files,
    },
    writable: false,
  });
  fileInputElement.dispatchEvent(loadFiles);
};

function DragDropInput({
  existingFiles,
  fileInputName,
  handleChange,
  multiple,
  ...remainingProps
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!inputRef.current) return;
    fileInput.on(inputRef.current);
  }, [inputRef]);

  useEffect(() => {
    const fileInputElement = window.document.getElementById('file-input');
    if (fileInputElement && existingFiles) {
      forceLoadFiles(fileInputElement, existingFiles);
    }
  }, []);

  return (
    <input
      {...remainingProps}
      accept=".pdf"
      className="usa-file-input"
      id="file-input"
      multiple={multiple}
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
  const { files, name: inputName } = e.target;
  const fileList = Array.from(files);

  const filesExceedingSizeLimit = Array.from(files)
    .map(capturedFile => {
      if (capturedFile.size >= maxFileSize * 1024 * 1024) {
        return capturedFile.name;
      }
    })
    .filter(file => !!file);

  if (filesExceedingSizeLimit.length) {
    const fileInputElement = window.document.getElementById(
      'file-input',
    ) as HTMLInputElement;

    alert(
      `Your file(s) size is too big. The maximum file size is ${maxFileSize}MB.
        ${filesExceedingSizeLimit.join(', \n')}
        `,
    );

    setTimeout(() => {
      const validFiles = fileList.filter(
        file => !filesExceedingSizeLimit.includes(file.name),
      );
      forceLoadFiles(fileInputElement, validFiles);
    }, 1);

    e.target.value = '';
    return false;
  }

  if (!files.length) return false;

  const clonedFilePromises = Array.from(files).map(capturedFile => {
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
    clearModalSequence: sequences['clearModalSequence'],
    constants: state.constants,
    form: state.form,
    invalidFiles: state.modal.invalidFiles,
    name: props.name,
    showModal: state.modal.showModal,
    updateFormValueSequence: sequences[props.updateFormValueSequence],

    // validationSequence: sequences[props.validationSequence],
  },
  function FileInput({
    constants,
    form,
    multiple,
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
          multiple={multiple}
        />
      </React.Fragment>
    );
  },
);
