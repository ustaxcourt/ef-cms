import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const Inclusions = connect(
  {
    form: state.form,
    marginClass: props.marginClass,
    updateSequence: sequences[props.updateSequence],
    validateDocketEntrySequence: sequences.validateDocketEntrySequence,
    validationErrors: state.validationErrors,
  },
  function Inclusions({
    form,
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
            >
              Certificate of Service
            </label>
            {form.certificateOfService && (
              <DateInput
                className="service-date margin-top-2"
                errorText={validationErrors.certificateOfServiceDate}
                hideLegend={true}
                id="service-date"
                label="Certificate of Service"
                names={{
                  day: 'certificateOfServiceDay',
                  month: 'certificateOfServiceMonth',
                  year: 'certificateOfServiceYear',
                }}
                values={{
                  day: form.certificateOfServiceDay,
                  month: form.certificateOfServiceMonth,
                  year: form.certificateOfServiceYear,
                }}
                onBlur={validateDocketEntrySequence}
                onChange={updateSequence}
              />
            )}
          </div>
        </fieldset>
      </div>
    );
  },
);
