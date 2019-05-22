import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const Inclusions = connect(
  {
    form: state.form,
    updateDocketEntryFormValueSequence:
      sequences.updateDocketEntryFormValueSequence,
    validateDocketEntrySequence: sequences.validateDocketEntrySequence,
    validationErrors: state.validationErrors,
  },
  ({
    form,
    updateDocketEntryFormValueSequence,
    validateDocketEntrySequence,
    validationErrors,
  }) => {
    return (
      <div className="usa-form-group">
        <fieldset className="usa-fieldset">
          <legend className="usa-legend">Inclusions</legend>
          <div className="usa-checkbox">
            <input
              id="exhibits"
              type="checkbox"
              name="exhibits"
              className="usa-checkbox__input"
              checked={form.exhibits || false}
              onChange={e => {
                updateDocketEntryFormValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
                validateDocketEntrySequence();
              }}
            />
            <label htmlFor="exhibits" className="usa-checkbox__label">
              Exhibit(s)
            </label>
          </div>
          <div className="usa-checkbox">
            <input
              id="attachments"
              type="checkbox"
              name="attachments"
              className="usa-checkbox__input"
              checked={form.attachments || false}
              onChange={e => {
                updateDocketEntryFormValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
                validateDocketEntrySequence();
              }}
            />
            <label htmlFor="attachments" className="usa-checkbox__label">
              Attachment(s)
            </label>
          </div>
          <div className="usa-checkbox">
            <input
              id="certificate-of-service"
              type="checkbox"
              name="certificateOfService"
              className="usa-checkbox__input"
              checked={form.certificateOfService || false}
              onChange={e => {
                updateDocketEntryFormValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
                validateDocketEntrySequence();
              }}
            />
            <label
              htmlFor="certificate-of-service"
              className="usa-checkbox__label"
            >
              Certificate of Service
            </label>
            {form.certificateOfService && (
              <fieldset
                className={`margin-bottom-0 usa-fieldset service-date
                        ${
                          validationErrors.certificateOfServiceDate
                            ? 'usa-form-group--error'
                            : ''
                        }`}
              >
                <legend
                  id="service-date-legend"
                  className="usa-legend usa-sr-only"
                >
                  Certificate of Service
                </legend>
                <div className="usa-memorable-date margin-top-2">
                  <div className="usa-form-group usa-form-group--month">
                    <input
                      className="usa-input usa-input--inline"
                      id="service-date-month"
                      aria-label="month, two digits"
                      aria-describedby="service-date-legend"
                      name="certificateOfServiceMonth"
                      value={form.certificateOfServiceMonth || ''}
                      type="number"
                      min="1"
                      max="12"
                      placeholder="MM"
                      onChange={e => {
                        updateDocketEntryFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                      onBlur={() => {
                        validateDocketEntrySequence();
                      }}
                    />
                  </div>
                  <div className="usa-form-group usa-form-group--day">
                    <input
                      className="usa-input usa-input--inline"
                      id="service-date-day"
                      name="certificateOfServiceDay"
                      value={form.certificateOfServiceDay || ''}
                      aria-label="day, two digits"
                      aria-describedby="service-date-legend"
                      type="number"
                      min="1"
                      max="31"
                      placeholder="DD"
                      onChange={e => {
                        updateDocketEntryFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                      onBlur={() => {
                        validateDocketEntrySequence();
                      }}
                    />
                  </div>
                  <div className="usa-form-group usa-form-group--year">
                    <input
                      className="usa-input usa-input--inline"
                      id="service-date-year"
                      aria-label="year, four digits"
                      aria-describedby="service-date-legend"
                      name="certificateOfServiceYear"
                      value={form.certificateOfServiceYear || ''}
                      type="number"
                      min="1900"
                      max="2100"
                      placeholder="YYYY"
                      onChange={e => {
                        updateDocketEntryFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                      onBlur={() => {
                        validateDocketEntrySequence();
                      }}
                    />
                  </div>
                </div>
                <Text
                  className="usa-error-message"
                  bind="validationErrors.certificateOfServiceDate"
                />
              </fieldset>
            )}
          </div>
        </fieldset>
      </div>
    );
  },
);
