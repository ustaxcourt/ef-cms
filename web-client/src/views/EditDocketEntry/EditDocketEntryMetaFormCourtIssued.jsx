import { CourtIssuedNonstandardForm } from '../CourtIssuedDocketEntry/CourtIssuedNonstandardForm';
import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { SelectSearch } from '../../ustc-ui/Select/SelectSearch';
import { connect } from '@cerebral/react';
import {
  courtIssuedDocketEntryOnChange,
  onInputChange,
  reactSelectValue,
} from '../../ustc-ui/utils/documentTypeSelectHelper';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditDocketEntryMetaFormCourtIssued = connect(
  {
    addCourtIssuedDocketEntryHelper: state.addCourtIssuedDocketEntryHelper,
    form: state.form,
    updateCourtIssuedDocketEntryFormValueSequence:
      sequences.updateCourtIssuedDocketEntryFormValueSequence,
    validateCourtIssuedDocketEntrySequence:
      sequences.validateCourtIssuedDocketEntrySequence,
    validateDocumentSequence: sequences.validateDocumentSequence,
    validationErrors: state.validationErrors,
  },
  function EditDocketEntryMetaFormCourtIssued({
    addCourtIssuedDocketEntryHelper,
    form,
    updateCourtIssuedDocketEntryFormValueSequence,
    validateCourtIssuedDocketEntrySequence,
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
          onChange={updateCourtIssuedDocketEntryFormValueSequence}
        />

        <FormGroup errorText={validationErrors.documentType}>
          <label
            className="usa-label"
            htmlFor="document-type"
            id="document-type-label"
          >
            Document type
          </label>
          {addCourtIssuedDocketEntryHelper.showDocumentTypeDropdown && (
            <SelectSearch
              aria-labelledby="document-type-label"
              id="document-type"
              name="eventCode"
              options={addCourtIssuedDocketEntryHelper.documentTypes}
              value={reactSelectValue({
                documentTypes: addCourtIssuedDocketEntryHelper.documentTypes,
                selectedEventCode: form.eventCode,
              })}
              onChange={(inputValue, { action, name }) => {
                courtIssuedDocketEntryOnChange({
                  action,
                  inputValue,
                  name,
                  updateSequence: updateCourtIssuedDocketEntryFormValueSequence,
                  validateSequence: validateCourtIssuedDocketEntrySequence,
                });
                return true;
              }}
              onInputChange={(inputText, { action }) => {
                onInputChange({
                  action,
                  inputText,
                  updateSequence: updateCourtIssuedDocketEntryFormValueSequence,
                });
              }}
            />
          )}
          {!addCourtIssuedDocketEntryHelper.showDocumentTypeDropdown && (
            <span>{form.documentType}</span>
          )}
        </FormGroup>

        {form.eventCode && <CourtIssuedNonstandardForm />}

        <FormGroup errorText={validationErrors.attachments}>
          <fieldset className="usa-fieldset">
            <legend className="usa-legend">Inclusions</legend>
            <div className="usa-checkbox">
              <input
                checked={form.attachments}
                className="usa-checkbox__input"
                id="attachments"
                name="attachments"
                type="checkbox"
                onChange={e => {
                  updateCourtIssuedDocketEntryFormValueSequence({
                    key: e.target.name,
                    value: e.target.checked,
                  });
                  validateCourtIssuedDocketEntrySequence();
                }}
              />
              <label className="usa-checkbox__label" htmlFor="attachments">
                Attachment(s)
              </label>
            </div>
          </fieldset>
        </FormGroup>
        <hr />
        <div className="usa-form-group">
          <fieldset className="usa-fieldset">
            <legend className="usa-legend">Track document?</legend>
            <div className="usa-checkbox">
              <input
                checked={form.pending || false}
                className="usa-checkbox__input"
                id="pending"
                name="pending"
                type="checkbox"
                onChange={e => {
                  updateCourtIssuedDocketEntryFormValueSequence({
                    key: e.target.name,
                    value: e.target.checked,
                  });
                }}
              />
              <label className="usa-checkbox__label" htmlFor="pending">
                Add to pending report
              </label>
            </div>
          </fieldset>
        </div>
      </div>
    );
  },
);
