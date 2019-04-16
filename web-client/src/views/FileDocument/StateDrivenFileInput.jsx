import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const StateDrivenFileInput = connect(
  {
    ariaDescribedBy: props.ariaDescribedBy,
    form: state.form,
    id: props.id,
    name: props.name,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateExternalDocumentInformationSequence:
      sequences.validateExternalDocumentInformationSequence,
  },
  ({
    ariaDescribedBy,
    form,
    id,
    name,
    updateFormValueSequence,
    validateExternalDocumentInformationSequence,
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
            updateFormValueSequence({
              key: e.target.name,
              value: e.target.files[0],
            });
            validateExternalDocumentInformationSequence();
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
