import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cloneFile } from '../cloneFile';
import { connect } from '@web-client/presenter/shared.cerebral';
import { limitFileSize } from '../limitFileSize';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const StateDrivenFileInput = connect(
  {
    ariaDescribedBy: props.ariaDescribedBy,
    constants: state.constants,
    file: props.file,
    fileInputName: props.name,
    form: state.form,
    id: props.id,
    ignoreSizeKey: props.ignoreSizeKey,
    updateFormValueSequence: sequences[props.updateFormValueSequence],
    validationSequence: sequences[props.validationSequence],
  },
  function StateDrivenFileInput({
    accept = '.pdf',
    ariaDescribedBy,
    constants,
    file,
    fileInputName,
    form,
    id,
    ignoreSizeKey,
    updateFormValueSequence,
    validationSequence,
    ...remainingProps
  }) {
    let inputRef;

    const fileOnForm = file || form[fileInputName] || form.existingFileName;

    return (
      <React.Fragment>
        <input
          {...remainingProps}
          accept={accept}
          aria-describedby={ariaDescribedBy}
          className="usa-input"
          data-testid={id}
          id={id}
          name={fileInputName}
          ref={ref => (inputRef = ref)}
          style={{
            display: fileOnForm ? 'none' : 'block',
          }}
          type="file"
          onChange={e => {
            const { name: inputName } = e.target;
            limitFileSize(e, constants.MAX_FILE_SIZE_MB, () => {
              const uploadedFile = e.target.files[0];
              cloneFile(uploadedFile)
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
            });
          }}
          onClick={e => {
            if (fileOnForm) e.preventDefault();
          }}
        />

        {fileOnForm && (
          <div>
            <span
              className="success-message icon-upload margin-right-1"
              data-testid="upload-file-success"
            >
              <FontAwesomeIcon icon="check-circle" size="1x" />
            </span>
            <span className="mr-1">
              {fileOnForm.name || form.existingFileName}
            </span>
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
                updateFormValueSequence({
                  key: `${fileInputName}Size`,
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

StateDrivenFileInput.displayName = 'StateDrivenFileInput';
