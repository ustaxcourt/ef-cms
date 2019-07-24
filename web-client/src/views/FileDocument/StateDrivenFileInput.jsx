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
  ({
    ariaDescribedBy,
    constants,
    form,
    id,
    name,
    updateFormValueSequence,
    validationSequence,
  }) => {
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
            limitFileSize(e, constants.MAX_FILE_SIZE_MB, () => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.files[0],
              });
              updateFormValueSequence({
                key: `${e.target.name}Size`,
                value: e.target.files[0].size,
              });
              validationSequence();
            });
          }}
          onClick={e => {
            if (form[name]) e.preventDefault();
          }}
        />

        {form[name] && (
          <div>
            <span className="mr-1">{form[name].name}</span>
            <button
              className="usa-button usa-button--unstyled margin-left-1"
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
            </button>
          </div>
        )}
      </React.Fragment>
    );
  },
);
