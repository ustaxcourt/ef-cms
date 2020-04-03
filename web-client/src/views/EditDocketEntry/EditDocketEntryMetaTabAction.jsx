import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditDocketEntryMetaTabAction = connect(
  {
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.modal.validationErrors,
    validationSequence: sequences.validateDocketRecordSequence,
  },
  function EditDocketEntryMetaTabAction({
    form,
    updateFormValueSequence,
    validationErrors,
    validationSequence,
  }) {
    return (
      <div className="blue-container">
        <FormGroup errorText={validationErrors && validationErrors.action}>
          <label className="usa-label" htmlFor="action" id="action-label">
            Action
          </label>
          <input
            aria-describedby="action-label"
            className="usa-input"
            id="action"
            name="action"
            type="text"
            value={form.action || ''}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validationSequence();
            }}
          />
        </FormGroup>
      </div>
    );
  },
);
