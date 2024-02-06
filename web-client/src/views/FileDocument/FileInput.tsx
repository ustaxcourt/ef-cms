import { cloneFile } from '../cloneFile';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect, useRef } from 'react';
import fileInput from '../../../../node_modules/@uswds/uswds/packages/usa-file-input/src';

const removeNode = node => {
  if (node && node.parentNode) {
    node.parentNode.removeChild(node);
  }
};

const updateFormValues = (files, updateFormValueSequence, inputName) => {
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
};

const removeFiles = dropTarget => {
  const previewHeading = dropTarget.querySelector(
    '.usa-file-input__preview-heading',
  );
  removeNode(previewHeading);

  const filePreviews = dropTarget.querySelectorAll('.usa-file-input__preview');
  filePreviews.forEach(file => {
    removeNode(file);
  });

  const instructions = dropTarget.querySelector(
    '.usa-file-input__instructions',
  );
  if (instructions) {
    instructions.removeAttribute('hidden');
  }
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
    const fileInputElement = window.document.getElementById(
      'file-input',
    ) as HTMLInputElement;
    if (fileInputElement && existingFiles) {
      const loadFilesFromFormEvent = new Event('change');

      Object.defineProperty(loadFilesFromFormEvent, 'target', {
        value: {
          files: existingFiles,
        },
        writable: false,
      });

      fileInputElement.dispatchEvent(loadFilesFromFormEvent);
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
  const { name: inputName } = e.target;
  const { files } = e.target;

  const dropTarget = window.document.querySelector(
    '.usa-file-input__target',
  ) as HTMLInputElement;

  if (Array.from(files).length > 5) {
    setTimeout(() => {
      removeFiles(dropTarget);
      e.target.value = '';
      alert('Maximum file limit is 5.');
    }, 10);
    return false;
  }

  const filesExceedingSizeLimit = Array.from(files)
    .map(capturedFile => {
      // if (capturedFile.size >= maxFileSize * 1024 * 1024) {
      if (capturedFile.size >= 40 * 1024 * 1024) {
        return capturedFile.name;
      }
    })
    .filter(file => !!file);

  if (filesExceedingSizeLimit.length) {
    setTimeout(() => {
      removeFiles(dropTarget);
      e.target.value = '';
      updateFormValues(e.target.files, updateFormValueSequence, inputName);
      alert(
        `The maximum file size is ${maxFileSize}MB. The following file(s) exceed the limit:
          ${filesExceedingSizeLimit.join(', \n')}
          `,
      );
    }, 10);
    return false;
  }

  if (!files.length) return false;

  updateFormValues(files, updateFormValueSequence, inputName);
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

FileInput.displayName = 'FileInput';
