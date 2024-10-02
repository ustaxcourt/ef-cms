import { CourtIssuedNonstandardForm } from '../CourtIssuedDocketEntry/CourtIssuedNonstandardForm';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { SelectSearch } from '@web-client/ustc-ui/Select/SelectSearch';
import { connect } from '@web-client/presenter/shared.cerebral';
import {
  onInputChange,
  reactSelectValue,
} from '@web-client/ustc-ui/Utils/documentTypeSelectHelper';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const EditDocketEntryMetaFormCourtIssued = connect(
  {
    DATE_FORMATS: state.constants.DATE_FORMATS,
    addCourtIssuedDocketEntryHelper: state.addCourtIssuedDocketEntryHelper,
    form: state.form,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    updateCourtIssuedDocketEntryFormValueSequence:
      sequences.updateCourtIssuedDocketEntryFormValueSequence,
    validateCourtIssuedDocketEntrySequence:
      sequences.validateCourtIssuedDocketEntrySequence,
    validateDocumentSequence: sequences.validateDocumentSequence,
    validationErrors: state.validationErrors,
  },
  function EditDocketEntryMetaFormCourtIssued({
    addCourtIssuedDocketEntryHelper,
    DATE_FORMATS,
    form,
    formatAndUpdateDateFromDatePickerSequence,
    updateCourtIssuedDocketEntryFormValueSequence,
    validateCourtIssuedDocketEntrySequence,
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
              data-testid="add-court-issued-document-type-search"
              id="document-type"
              isClearable={true}
              name="eventCode"
              options={addCourtIssuedDocketEntryHelper.documentTypes}
              value={reactSelectValue({
                documentTypes: addCourtIssuedDocketEntryHelper.documentTypes,
                selectedEventCode: form.eventCode,
              })}
              onChange={inputValue => {
                [
                  'documentType',
                  'documentTitle',
                  'eventCode',
                  'scenario',
                ].forEach(key =>
                  updateCourtIssuedDocketEntryFormValueSequence({
                    key,
                    value: inputValue ? inputValue[key] : '',
                  }),
                );
                validateCourtIssuedDocketEntrySequence();
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

EditDocketEntryMetaFormCourtIssued.displayName =
  'EditDocketEntryMetaFormCourtIssued';
