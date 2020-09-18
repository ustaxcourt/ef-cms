import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditDocketEntryMetaFormNoDocument = connect(
  {
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateDocumentSequence: sequences.validateDocumentSequence,
    validationErrors: state.validationErrors,
  },
  function EditDocketEntryMetaFormNoDocument({
    form,
    updateFormValueSequence,
    validateDocumentSequence,
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
          onBlur={validateDocumentSequence}
          onChange={updateFormValueSequence}
        />

        <FormGroup errorText={validationErrors.documentTitle}>
          <label
            className="usa-label"
            htmlFor="documentTitle"
            id="documentTitle-label"
          >
            Filings and proceedings
          </label>
          <input
            aria-describedby="documentTitle-label"
            className="usa-input"
            id="documentTitle"
            name="documentTitle"
            type="text"
            value={form.documentTitle || ''}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              validateDocumentSequence();
            }}
          />
        </FormGroup>
      </div>
    );
  },
);
