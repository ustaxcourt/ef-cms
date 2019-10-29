import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const Inclusions = connect(
  {
    form: state.form,
    marginClass: props.marginClass,
    updateDocketEntryFormValueSequence:
      sequences.updateDocketEntryFormValueSequence,
    validateDocketEntrySequence: sequences.validateDocketEntrySequence,
    validationErrors: state.validationErrors,
  },
  ({
    form,
    marginClass,
    updateDocketEntryFormValueSequence,
    validateDocketEntrySequence,
    validationErrors,
  }) => {
    return (
      <div className={classNames('usa-form-group', marginClass)}>
        <fieldset className={classNames('usa-fieldset', marginClass)}>
          <legend className="usa-legend">
            Inclusions <span className="usa-hint">(optional)</span>
          </legend>
          <div className="usa-checkbox">
            <input
              checked={form.attachments || false}
              className="usa-checkbox__input"
              id="attachments"
              name="attachments"
              type="checkbox"
              onChange={e => {
                updateDocketEntryFormValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
                validateDocketEntrySequence();
              }}
            />
            <label className="usa-checkbox__label" htmlFor="attachments">
              Attachment(s)
            </label>
          </div>
          <div className="usa-checkbox">
            <input
              checked={form.certificateOfService || false}
              className="usa-checkbox__input"
              id="certificate-of-service"
              name="certificateOfService"
              type="checkbox"
              onChange={e => {
                updateDocketEntryFormValueSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
                validateDocketEntrySequence();
              }}
            />
            <label
              className="usa-checkbox__label"
              htmlFor="certificate-of-service"
            >
              Certificate of Service
            </label>
            {form.certificateOfService && (
              <FormGroup
                className="service-date"
                errorText={validationErrors.certificateOfServiceDate}
              >
                <fieldset
                  className={classNames('margin-bottom-0 usa-fieldset')}
                >
                  <legend
                    className="usa-legend usa-sr-only"
                    id="service-date-legend"
                  >
                    Certificate of Service
                  </legend>
                  <div className="usa-memorable-date margin-top-2">
                    <div className="usa-form-group usa-form-group--month">
                      <input
                        aria-describedby="service-date-legend"
                        aria-label="month, two digits"
                        className="usa-input usa-input--inline"
                        id="service-date-month"
                        max="12"
                        min="1"
                        name="certificateOfServiceMonth"
                        placeholder="MM"
                        type="number"
                        value={form.certificateOfServiceMonth || ''}
                        onBlur={() => {
                          validateDocketEntrySequence();
                        }}
                        onChange={e => {
                          updateDocketEntryFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="usa-form-group usa-form-group--day">
                      <input
                        aria-describedby="service-date-legend"
                        aria-label="day, two digits"
                        className="usa-input usa-input--inline"
                        id="service-date-day"
                        max="31"
                        min="1"
                        name="certificateOfServiceDay"
                        placeholder="DD"
                        type="number"
                        value={form.certificateOfServiceDay || ''}
                        onBlur={() => {
                          validateDocketEntrySequence();
                        }}
                        onChange={e => {
                          updateDocketEntryFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="usa-form-group usa-form-group--year">
                      <input
                        aria-describedby="service-date-legend"
                        aria-label="year, four digits"
                        className="usa-input usa-input--inline"
                        id="service-date-year"
                        max="2100"
                        min="1900"
                        name="certificateOfServiceYear"
                        placeholder="YYYY"
                        type="number"
                        value={form.certificateOfServiceYear || ''}
                        onBlur={() => {
                          validateDocketEntrySequence();
                        }}
                        onChange={e => {
                          updateDocketEntryFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                </fieldset>
              </FormGroup>
            )}
          </div>
        </fieldset>
      </div>
    );
  },
);
