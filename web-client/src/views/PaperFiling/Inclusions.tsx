import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const Inclusions = connect(
  {
    DATE_FORMATS: state.constants.DATE_FORMATS,
    form: state.form,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    marginClass: props.marginClass,
    updateSequence: sequences[props.updateSequence],
    validateDocketEntrySequence: sequences.validateDocketEntrySequence,
    validationErrors: state.validationErrors,
  },
  function Inclusions({
    DATE_FORMATS,
    form,
    formatAndUpdateDateFromDatePickerSequence,
    marginClass,
    updateSequence,
    validateDocketEntrySequence,
    validationErrors,
  }) {
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
                updateSequence({
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
                updateSequence({
                  key: e.target.name,
                  value: e.target.checked,
                });
                validateDocketEntrySequence();
              }}
            />
            <label
              className="usa-checkbox__label"
              htmlFor="certificate-of-service"
              id="certificate-of-service-label"
            >
              Certificate of Service
            </label>

            {form.certificateOfService && (
              <DateSelector
                defaultValue={form.certificateOfServiceDate}
                errorText={validationErrors.certificateOfServiceDate}
                formGroupClassNames="service-date margin-top-2"
                id="service-date"
                label="Certificate of Service"
                onChange={e => {
                  formatAndUpdateDateFromDatePickerSequence({
                    key: 'certificateOfServiceDate',
                    toFormat: DATE_FORMATS.ISO,
                    value: e.target.value,
                  });
                  validateDocketEntrySequence();
                }}
              />
            )}
          </div>
        </fieldset>
      </div>
    );
  },
);

Inclusions.displayName = 'Inclusions';
