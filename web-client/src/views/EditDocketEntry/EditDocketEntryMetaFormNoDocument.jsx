import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditDocketEntryMetaFormNoDocument = connect(
  {
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateDocketRecordSequence: sequences.validateDocketRecordSequence,
    validationErrors: state.validationErrors,
  },
  function EditDocketEntryMetaFormNoDocument({
    form,
    updateFormValueSequence,
    validateDocketRecordSequence,
    validationErrors,
  }) {
    return (
      <div className="blue-container">
        <DateInput
          errorText={validationErrors.filingDate}
          id="filing-date"
          label="Filed date"
          names={{
            day: 'filingDateDay',
            month: 'filingDateMonth',
            year: 'filingDateYear',
          }}
          values={{
            day: form.filingDateDay,
            month: form.filingDateMonth,
            year: form.filingDateYear,
          }}
          onBlur={validateDocketRecordSequence}
          onChange={updateFormValueSequence}
        />

        <FormGroup errorText={validationErrors.description}>
          <label
            className="usa-label"
            htmlFor="description"
            id="description-label"
          >
            Filings and proceedings
          </label>
          <input
            aria-describedby="description-label"
            className="usa-input"
            id="description"
            name="description"
            type="text"
            value={form.description || ''}
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
