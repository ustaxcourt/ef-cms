import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cloneFile } from '../cloneFile';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

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

export const StateDrivenMultiFileInput = connect(
  {
    ariaDescribedBy: props.ariaDescribedBy,
    constants: state.constants,
    fileInputName: props.name,
    form: state.form,
    id: props.id,
    updateFormValueSequence: sequences[props.updateFormValueSequence],
    // validationSequence: sequences[props.validationSequence],
  },
  function StateDrivenMultiFileInput({
    accept = '.pdf',
    ariaDescribedBy,
    constants,
    fileInputName,
    form,
    id,
    updateFormValueSequence,
    // validationSequence,
    ...remainingProps
  }) {
    let inputRef;
    const filesOnForm = form[fileInputName];

    return (
      <React.Fragment>
        <input
          {...remainingProps}
          multiple
          accept={accept}
          aria-describedby={ariaDescribedBy}
          className="usa-input"
          data-testid={id}
          id={id}
          name={fileInputName}
          ref={ref => (inputRef = ref)}
          style={{
            display: filesOnForm?.length ? 'none' : 'block',
          }}
          type="file"
          onChange={e =>
            handleFileSelectionAndValidation(
              e,
              constants.MAX_FILE_SIZE_MB,
              updateFormValueSequence,
            )
          }
          onClick={e => {
            if (filesOnForm?.length) e.preventDefault();
          }}
        />
        {!!filesOnForm?.length && (
          <div>
            {filesOnForm.map(file => {
              return (
                <div className="margin-bottom-1" key={file.name}>
                  <span
                    className="success-message icon-upload margin-right-1"
                    data-testid="upload-file-success"
                  >
                    <FontAwesomeIcon icon="check-circle" size="1x" />
                  </span>
                  {file.name}
                </div>
              );
            })}
            <Button
              link
              className="ustc-button--mobile-inline margin-left-1"
              onClick={() => {
                updateFormValueSequence({
                  key: fileInputName,
                  value: null,
                });
                updateFormValueSequence({
                  key: 'existingFileName',
                  value: null,
                });
                inputRef.value = null;
                inputRef.click();
              }}
            >
              Change
            </Button>
          </div>
        )}
      </React.Fragment>
    );
  },
);

StateDrivenMultiFileInput.displayName = 'StateDrivenMultiFileInput';
