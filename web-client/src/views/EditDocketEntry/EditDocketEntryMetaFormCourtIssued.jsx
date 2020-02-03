import { CourtIssuedNonstandardForm } from '../CourtIssuedDocketEntry/CourtIssuedNonstandardForm';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import {
  courtIssuedDocketEntryOnChange,
  onInputChange,
  reactSelectValue,
} from '../../ustc-ui/utils/documentTypeSelectHelper';
import { limitLength } from '../../ustc-ui/utils/limitLength';
import { sequences, state } from 'cerebral';
import React from 'react';
import Select from 'react-select';
import classNames from 'classnames';

export const EditDocketEntryMetaFormCourtIssued = connect(
  {
    addCourtIssuedDocketEntryHelper: state.addCourtIssuedDocketEntryHelper,
    form: state.form,
    updateCourtIssuedDocketEntryFormValueSequence:
      sequences.updateCourtIssuedDocketEntryFormValueSequence,
    validateCourtIssuedDocketEntrySequence:
      sequences.validateCourtIssuedDocketEntrySequence,
    validateDocketRecordSequence: sequences.validateDocketRecordSequence,
    validationErrors: state.validationErrors,
  },
  ({
    addCourtIssuedDocketEntryHelper,
    form,
    updateCourtIssuedDocketEntryFormValueSequence,
    validateCourtIssuedDocketEntrySequence,
    validateDocketRecordSequence,
    validationErrors,
  }) => {
    return (
      <div className="blue-container">
        <FormGroup errorText={validationErrors.filingDate}>
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend className="usa-legend" id="filing-date-legend">
              Filed date
            </legend>
            <div className="usa-memorable-date">
              <div className="usa-form-group usa-form-group--month margin-bottom-0">
                <input
                  aria-describedby="filing-date-legend"
                  aria-label="month, two digits"
                  className={classNames(
                    'usa-input usa-input--inline',
                    validationErrors.filingDate && 'usa-error',
                  )}
                  id="filing-date-month"
                  max="12"
                  maxLength="2"
                  min="1"
                  name="filingDateMonth"
                  type="number"
                  value={form.filingDateMonth || ''}
                  onBlur={() => validateDocketRecordSequence()}
                  onChange={e => {
                    updateCourtIssuedDocketEntryFormValueSequence({
                      key: e.target.name,
                      value: limitLength(e.target.value, 2),
                    });
                  }}
                />
              </div>
              <div className="usa-form-group usa-form-group--day margin-bottom-0">
                <input
                  aria-describedby="filing-date-legend"
                  aria-label="day, two digits"
                  className={classNames(
                    'usa-input usa-input--inline',
                    validationErrors.filingDate && 'usa-error',
                  )}
                  id="filing-date-day"
                  max="31"
                  maxLength="2"
                  min="1"
                  name="filingDateDay"
                  type="number"
                  value={form.filingDateDay || ''}
                  onBlur={() => validateDocketRecordSequence()}
                  onChange={e => {
                    updateCourtIssuedDocketEntryFormValueSequence({
                      key: e.target.name,
                      value: limitLength(e.target.value, 2),
                    });
                  }}
                />
              </div>
              <div className="usa-form-group usa-form-group--year margin-bottom-0">
                <input
                  aria-describedby="filing-date-legend"
                  aria-label="year, four digits"
                  className={classNames(
                    'usa-input usa-input--inline',
                    validationErrors.filingDate && 'usa-error',
                  )}
                  id="filing-date-year"
                  max="2100"
                  maxLength="4"
                  min="1900"
                  name="filingDateYear"
                  type="number"
                  value={form.filingDateYear || ''}
                  onBlur={() => validateDocketRecordSequence()}
                  onChange={e => {
                    updateCourtIssuedDocketEntryFormValueSequence({
                      key: e.target.name,
                      value: limitLength(e.target.value, 4),
                    });
                  }}
                />
              </div>
            </div>
          </fieldset>
        </FormGroup>

        <FormGroup errorText={validationErrors.documentType}>
          <label
            className="usa-label"
            htmlFor="document-type"
            id="document-type-label"
          >
            Document type
          </label>
          <Select
            aria-labelledby="document-type-label"
            className="select-react-element"
            classNamePrefix="select-react-element"
            id="document-type"
            isClearable={true}
            name="eventCode"
            options={addCourtIssuedDocketEntryHelper.documentTypes}
            placeholder="- Select -"
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
              <label
                className="usa-checkbox__label inline-block"
                htmlFor="attachments"
              >
                Attachment(s)
              </label>
            </div>
          </fieldset>
        </FormGroup>
      </div>
    );
  },
);
