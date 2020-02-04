import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { classNames } from 'classnames';
import { connect } from '@cerebral/react';
import { limitLength } from '../../ustc-ui/utils/limitLength';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditDocketEntryMetaFormNoDocument = connect(
  {
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
    validationSequence:
      sequences[state.editDocketEntryMetaHelper].validationSequenceName,
  },
  ({ form, updateFormValueSequence, validationErrors, validationSequence }) => {
    return (
      <div className="blue-container">
        <FormGroup errorText={validationErrors.filingDate}>
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend className="usa-legend" id="filing-date-legend">
              Filing Date
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
                  onBlur={() => validationSequence()}
                  onChange={e => {
                    updateFormValueSequence({
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
                  onBlur={() => validationSequence()}
                  onChange={e => {
                    updateFormValueSequence({
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
                  onBlur={() => validationSequence()}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: limitLength(e.target.value, 4),
                    });
                  }}
                />
              </div>
            </div>
          </fieldset>
        </FormGroup>

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
              validationSequence();
            }}
          />
        </FormGroup>
      </div>
    );
  },
);
