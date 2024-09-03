import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cloneFile } from '../FileHandlingHelpers/cloneFile';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { validateFile } from '@web-client/views/FileHandlingHelpers/fileValidation';
import React from 'react';

type StateDriveFileInputProps = {
  'aria-describedby': string;
  file?: File;
  id: string;
  updateFormValueSequence: string;
  validationSequence: string;
  name: string;
  accept?: string;
  ignoreSizeKey?: boolean;
};

const deps = {
  constants: state.constants,
  form: state.form,
  showErrorModalSequence: sequences.showErrorModalSequence,
  updateFormValueSequence: sequences[props.updateFormValueSequence],
  validationSequence: sequences[props.validationSequence],
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
    showErrorModalSequence,
    updateFormValueSequence,
    validationSequence,
    ...remainingProps
  }) {
    let inputRef;

    const fileOnForm = file || form[fileInputName] || form.existingFileName;

    const onFileSelectionChange = async e => {
      const { name: inputName } = e.target;
      const selectedFile = e.target.files[0];
      const { errorMessage, isValid } = await validateFile({
        file: selectedFile,
        megabyteLimit: constants.MAX_FILE_SIZE_MB,
      });
      if (!isValid) {
        showErrorModalSequence({
          errorToLog: errorMessage,
          message: errorMessage!,
          title: 'File Upload Error',
        });
        e.target.value = null;
        return;
      }
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
    };

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
          onChange={onFileSelectionChange}
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
