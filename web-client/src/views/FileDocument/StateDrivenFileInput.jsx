import { connect } from '@cerebral/react';
import { limitFileSize } from '../limitFileSize';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const StateDrivenFileInput = connect(
  {
    ariaDescribedBy: props.ariaDescribedBy,
    form: state.form,
    id: props.id,
    maxFileSize: props.maxFileSize,
    name: props.name,
    updateFormValueSequence: sequences[props.updateFormValueSequence],
    validationSequence: sequences[props.validationSequence],
  },
  ({
    ariaDescribedBy,
    form,
    id,
    name,
    updateFormValueSequence,
    validationSequence,
    maxFileSize,
  }) => {
    let inputRef;

    return (
      <React.Fragment>
        <input
          id={id}
          type="file"
          accept=".pdf"
          style={{
            display: form[name] ? 'none' : 'block',
          }}
          ref={ref => (inputRef = ref)}
          name={name}
          aria-describedby={ariaDescribedBy}
          onClick={e => {
            if (form[name]) e.preventDefault();
          }}
          onChange={e => {
            limitFileSize(e, maxFileSize, () => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.files[0],
              });
              updateFormValueSequence({
                key: `${e.target.name}Size`,
                value: e.target.files[0],
              });
              validationSequence();
            });
          }}
        />

        {form[name] && (
          <div>
            <span className="mr-1">{form[name].name}</span>
            <button
              className="link"
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
