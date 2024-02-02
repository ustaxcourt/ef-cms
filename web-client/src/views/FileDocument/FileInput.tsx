import { ModalDialog } from '@web-client/views/ModalDialog';
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

const removeFilesExceedingLimit = (dropTarget, e, filesExceedingSizeLimit) => {
  const currentPreviewHeading = dropTarget.querySelector(
    '.usa-file-input__preview-heading',
  );
  removeNode(currentPreviewHeading);

  const filePreviews = dropTarget.querySelectorAll('.usa-file-input__preview');
  const updatedFiles = [];
  filePreviews.forEach((file, index) => {
    const fileName = file.textContent.trim();
    if (filesExceedingSizeLimit.includes(fileName)) {
      removeNode(file);
    } else {
      updatedFiles.push(e.target.files[index]);
    }
  });

  const dataTransfer = new DataTransfer();
  updatedFiles.forEach(file => {
    dataTransfer.items.add(file);
  });

  e.target.files = dataTransfer.files;

  const instructions = dropTarget.querySelector(
    '.usa-file-input__instructions',
  );
  if (filesExceedingSizeLimit.length === filePreviews.length && instructions) {
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
  openInvalidFilesModalSequence,
) {
  const { name: inputName } = e.target;
  const { files } = e.target;

  const filesExceedingSizeLimit = Array.from(files)
    .map(capturedFile => {
      if (capturedFile.size >= maxFileSize * 1024 * 1024) {
        return capturedFile.name;
      }
    })
    .filter(file => !!file);

  if (filesExceedingSizeLimit.length) {
    setTimeout(() => {
      const dropTarget = window.document.querySelector(
        '.usa-file-input__target',
      ) as HTMLInputElement;

      removeFilesExceedingLimit(dropTarget, e, filesExceedingSizeLimit);
      openInvalidFilesModalSequence({
        invalidFiles: filesExceedingSizeLimit,
        modalId: 'invalidFilesModal',
      });
    }, 1);
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
    openInvalidFilesModalSequence: sequences.openInvalidFilesModalSequence,
    showModal: state.modal.showModal,
    updateFormValueSequence: sequences[props.updateFormValueSequence],

    // validationSequence: sequences[props.validationSequence],
  },
  function FileInput({
    clearModalSequence,
    constants,
    form,
    invalidFiles,
    multiple,
    name,
    openInvalidFilesModalSequence,
    showModal,
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
              openInvalidFilesModalSequence,
            )
          }
          multiple={multiple}
        />
        {showModal === 'invalidFilesModal' && (
          <SizeLimitModal
            confirmModalSequence={clearModalSequence}
            invalidFiles={invalidFiles}
          />
        )}
      </React.Fragment>
    );
  },
);

function SizeLimitModal({ confirmModalSequence, invalidFiles }) {
  return (
    <ModalDialog
      confirmLabel="Ok"
      confirmSequence={() => confirmModalSequence()}
      title="Unable to Upload File"
    >
      <div className="margin-bottom-4" id="file-upload-error-modal">
        <p>There was a problem with the selected file(s):</p>
        {invalidFiles.map(file => {
          <p>{file}</p>;
        })}
        <p>Your file exceeds the maximum size of 250MB.</p>
        <p>
          If you still have a problem after troubleshooting your files, email
          {''}
          <a href="mailto:dawson.support@ustaxcourt.gov">
            dawson.support@ustaxcourt.gov
          </a>
          .
        </p>
      </div>
    </ModalDialog>
  );
}
