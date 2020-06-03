import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { cloneFile } from '../cloneFile';
import { connect } from '@cerebral/react';
import { limitFileSize } from '../limitFileSize';
import { props, sequences, state } from 'cerebral';
import React from 'react';
export const StateDrivenFileInput = connect(
  {
    ariaDescribedBy: props.ariaDescribedBy,
    constants: state.constants,
    form: state.form,
    id: props.id,
    name: props.name,
    updateFormValueSequence: sequences[props.updateFormValueSequence],
    validationSequence: sequences[props.validationSequence],
  },
  function StateDrivenFileInput({
    ariaDescribedBy,
    constants,
    form,
    id,
    name,
    updateFormValueSequence,
    validationSequence,
  }) {
    let inputRef;

    return (
      <React.Fragment>
        <input
          accept=".pdf"
          aria-describedby={ariaDescribedBy}
          className="usa-input"
          id={id}
          name={name}
          ref={ref => (inputRef = ref)}
          style={{
            display: form[name] ? 'none' : 'block',
          }}
          type="file"
          onChange={e => {
            const { name } = e.target;
            limitFileSize(e, constants.MAX_FILE_SIZE_MB, () => {
              const file = e.target.files[0];
              cloneFile(file)
                .then(clonedFile => {
                  updateFormValueSequence({
                    key: name,
                    value: clonedFile,
                  });
                  updateFormValueSequence({
                    key: `${name}Size`,
                    value: clonedFile.size,
                  });
                  return validationSequence();
                })
                .catch(() => {
                  /* no-op */
                });
            });
          }}
          onClick={e => {
            if (form[name]) e.preventDefault();
          }}
        />

        {form[name] && (
          <div>
            <span className="success-message icon-upload margin-right-1">
              <FontAwesomeIcon icon="check-circle" size="1x" />
            </span>
            <span className="mr-1">{form[name].name}</span>
            <Button
              link
              className="ustc-button--mobile-inline margin-left-1"
              onClick={() => {
                updateFormValueSequence({
                  key: name,
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
