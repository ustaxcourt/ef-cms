import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const EditDocketEntryMetaTabService = connect(
  {
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateDocketRecordSequence: sequences.validateDocketRecordSequence,
    validationErrors: state.modal.validationErrors,
  },
  ({
    form,
    updateFormValueSequence,
    validateDocketRecordSequence,
    validationErrors,
  }) => {
    return (
      <div className="blue-container">
        <FormGroup errorText={validationErrors && validationErrors.servedDate}>
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend className="usa-legend" id="served-date-legend">
              Served Date
            </legend>
            <div className="usa-memorable-date">
              <div className="usa-form-group usa-form-group--month margin-bottom-0">
                <input
                  aria-describedby="served-date-legend"
                  aria-label="month, two digits"
                  className={classNames(
                    'usa-input usa-input--inline',
                    validationErrors &&
                      validationErrors.servedDate &&
                      'usa-input--error',
                  )}
                  id="served-date-month"
                  max="12"
                  min="1"
                  name="servedDateMonth"
                  placeholder="MM"
                  type="number"
                  value={form.servedDateMonth || ''}
                  onBlur={() => validateDocketRecordSequence()}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="usa-form-group usa-form-group--day margin-bottom-0">
                <input
                  aria-describedby="served-date-legend"
                  aria-label="day, two digits"
                  className={classNames(
                    'usa-input usa-input--inline',
                    validationErrors &&
                      validationErrors.servedDate &&
                      'usa-input--error',
                  )}
                  id="served-date-day"
                  max="31"
                  min="1"
                  name="servedDateDay"
                  placeholder="DD"
                  type="number"
                  value={form.servedDateDat || ''}
                  onBlur={() => validateDocketRecordSequence()}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </div>
              <div className="usa-form-group usa-form-group--year margin-bottom-0">
                <input
                  aria-describedby="served-date-legend"
                  aria-label="year, four digits"
                  className={classNames(
                    'usa-input usa-input--inline',
                    validationErrors &&
                      validationErrors.servedDate &&
                      'usa-input--error',
                  )}
                  id="served-date-year"
                  max="2100"
                  min="1900"
                  name="servedDateYear"
                  placeholder="YYYY"
                  type="number"
                  value={form.servedDateYear || ''}
                  onBlur={() => validateDocketRecordSequence()}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </div>
            </div>
          </fieldset>
        </FormGroup>
        <FormGroup
          errorText={validationErrors && validationErrors.servedPartiesCode}
        >
          <fieldset
            className="usa-fieldset margin-bottom-2"
            id="served-parties-radios"
          >
            <legend htmlFor="served-parties-radios">Parties Served</legend>
            <div className="usa-radio">
              <input
                aria-describedby="served-parties-radios"
                checked={form.eventCode === 'P'}
                className="usa-radio__input"
                id="served-parties-p"
                name="eventCode"
                type="radio"
                value="P"
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateDocketRecordSequence();
                }}
              />
              <label
                className="usa-radio__label"
                htmlFor="served-parties-p"
                id="served-parties-p-label"
              >
                Petitioner
              </label>
            </div>
            <div className="usa-radio">
              <input
                aria-describedby="served-parties-radios"
                checked={form.eventCode === 'R'}
                className="usa-radio__input"
                id="served-parties-r"
                name="eventCode"
                type="radio"
                value="R"
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateDocketRecordSequence();
                }}
              />
              <label
                className="usa-radio__label"
                htmlFor="served-parties-pr"
                id="served-parties-r-label"
              >
                Respondent
              </label>
            </div>
            <div className="usa-radio">
              <input
                aria-describedby="served-parties-radios"
                checked={form.eventCode === 'B'}
                className="usa-radio__input"
                id="served-parties-b"
                name="eventCode"
                type="radio"
                value="B"
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateDocketRecordSequence();
                }}
              />
              <label
                className="usa-radio__label"
                htmlFor="served-parties-b"
                id="served-parties-b-label"
              >
                Both
              </label>
            </div>
          </fieldset>
        </FormGroup>
      </div>
    );
  },
);
