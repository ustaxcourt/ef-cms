import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditDocketEntryMetaTabAction = connect(
  {
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateDocketRecordSequence: sequences.validateDocketRecordSequence,
    validationErrors: state.modal.validationErrors,
  },
  ({
    form,
    updateFormValueSequence,
    validateDocketRecordSequence,
    validationErrors,
  }) => {
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
            name="form.action"
            type="text"
            value={form.action || ''}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateDocketRecordSequence();
            }}
          />
        </FormGroup>
      </div>
    );
  },
);
