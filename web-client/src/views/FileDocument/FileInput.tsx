import { MAX_FILE_SIZE_BYTES } from '@shared/business/entities/EntityConstants';
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

const updateFormValues = ({
  files,
  inputName,
  updateFormValueSequence,
  validationSequence,
}: {
  files: File[];
  inputName: string;
  updateFormValueSequence: Function;
  validationSequence: Function;
}) => {
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
      validationSequence();
    })
    .catch(() => {
      /* no-op */
    });
};

const removeFiles = (inputName, updateFormValueSequence) => {
  const dropTarget = window.document.querySelector(
    '.usa-file-input__target',
  ) as HTMLInputElement;
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
  const fileInputElement = window.document.getElementById(
    'file-input',
  ) as HTMLInputElement;
  fileInputElement.value = '';

  updateFormValueSequence({
    key: inputName,
    value: [],
  });
};

function DragDropInput({
  existingFiles,
  fileInputName,
  handleChange,
  handleRemove,
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

  useEffect(() => {
    if (existingFiles?.length) {
      const chooseFilesSpan = window.document.querySelector(
        '.usa-file-input__choose',
      );
      if (chooseFilesSpan) {
        removeNode(chooseFilesSpan);
      }
    }
  }, [existingFiles]);

  return (
    <div style={{ maxWidth: '60%', position: 'relative' }}>
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
      {!!existingFiles?.length && (
        <div
          className="usa-file-input__remove"
          style={{
            color: '#005ea2',
            cursor: 'pointer',
            fontSize: '15px',
            left: '75%',
            position: 'absolute',
            textDecoration: 'underline',
            top: '9px',
            zIndex: 10,
          }}
          onClick={handleRemove}
        >
          Remove File{existingFiles.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
}

function handleFileSelectionAndValidation({
  files,
  inputName,
  maxFileSize,
  updateFormValueSequence,
  validationSequence,
}: {
  files: File[];
  inputName: string;
  maxFileSize: number;
  updateFormValueSequence: Function;
  validationSequence: Function;
}): false | undefined {
  const maxFileUploads = 5;
  if (Array.from(files).length > maxFileUploads) {
    setTimeout(() => {
      removeFiles(inputName, updateFormValueSequence);
      alert('Maximum file limit is 5.');
    }, 10);
    return false;
  }

  const filesExceedingSizeLimit = Array.from(files)
    .map(capturedFile => {
      if (capturedFile.size >= MAX_FILE_SIZE_BYTES) {
        return capturedFile.name;
      }
    })
    .filter(file => !!file);

  if (filesExceedingSizeLimit.length) {
    setTimeout(() => {
      removeFiles(inputName, updateFormValueSequence);
      alert(
        `The maximum file size is ${maxFileSize}MB. The following file(s) exceed the limit:
          ${filesExceedingSizeLimit.join(', \n')}
          `,
      );
    }, 10);
    return false;
  }

  if (!files.length) return false;

  updateFormValues({
    files,
    inputName,
    updateFormValueSequence,
    validationSequence,
  });
}

export const FileInput = connect(
  {
    constants: state.constants,
    form: state.form,
    name: props.name,
    updateFormValueSequence: sequences[props.updateFormValueSequence],
    validationSequence: sequences[props.validationSequence],
  },
  function FileInput({
    constants,
    form,
    multiple,
    name,
    updateFormValueSequence,
    validationSequence,
    ...remainingProps
  }) {
    return (
      <React.Fragment>
        <DragDropInput
          {...remainingProps}
          existingFiles={form[name]}
          fileInputName={name}
          handleChange={e => {
            const { files, name: inputName } = e.target;

            handleFileSelectionAndValidation({
              files,
              inputName,
              maxFileSize: constants.MAX_FILE_SIZE_MB,
              updateFormValueSequence,
              validationSequence,
            });
          }}
          handleRemove={() => {
            removeFiles(name, updateFormValueSequence);
          }}
          multiple={multiple}
        />
      </React.Fragment>
    );
  },
);

FileInput.displayName = 'FileInput';
