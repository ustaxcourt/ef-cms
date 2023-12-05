import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const EditDocketEntryMetaFormNoDocument = connect(
  {
    DATE_FORMATS: state.constants.DATE_FORMATS,
    form: state.form,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateDocumentSequence: sequences.validateDocumentSequence,
    validationErrors: state.validationErrors,
  },
  function EditDocketEntryMetaFormNoDocument({
    DATE_FORMATS,
    form,
    formatAndUpdateDateFromDatePickerSequence,
    updateFormValueSequence,
    validateDocumentSequence,
    validationErrors,
  }) {
    return (
      <div className="blue-container">
        <DateSelector
          defaultValue={form.filingDate}
          errorText={validationErrors.filingDate}
          id="filing-date"
          label="Filed date"
          onChange={e => {
            formatAndUpdateDateFromDatePickerSequence({
              key: 'filingDate',
              toFormat: DATE_FORMATS.ISO,
              value: e.target.value,
            });
            validateDocumentSequence();
          }}
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

EditDocketEntryMetaFormNoDocument.displayName =
  'EditDocketEntryMetaFormNoDocument';
