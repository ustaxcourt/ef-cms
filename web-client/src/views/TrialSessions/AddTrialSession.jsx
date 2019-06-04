import { BigHeader } from '../BigHeader';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AddTrialSession = connect(
  {
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  ({ validationErrors, form, updateFormValueSequence }) => {
    return (
      <>
        <BigHeader text="Trial Sessions" />

        <section className="usa-section grid-container DocumentDetail">
          <SuccessNotification />
          <ErrorNotification />

          <h1>Add Trial Session</h1>
          <p>All fields required unless otherwise noted</p>

          <h2 className="margin-top-4">Session Information</h2>
          <div className="blue-container">
            <div
              className={`usa-form-group ${
                validationErrors.term ? 'usa-form-group--error' : ''
              }`}
            >
              <fieldset className="usa-fieldset">
                <legend id="term-legend">Term</legend>
                {['Winter', 'Spring', 'Fall'].map(option => (
                  <div className="usa-radio usa-radio__inline" key={option}>
                    <input
                      id={`term-${option}`}
                      type="radio"
                      name="term"
                      className="usa-radio__input"
                      value={option}
                      aria-describedby="term-legend"
                      checked={form.term === option}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                    <label
                      htmlFor={`term-${option}`}
                      className="usa-radio__label"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </fieldset>
              <Text
                className="usa-error-message"
                bind="validationErrors.term"
              />
            </div>

            <div
              className={`usa-form-group ${
                validationErrors.startDate ? 'usa-form-group--error' : ''
              }`}
            >
              <fieldset className="start-date usa-fieldset margin-bottom-0">
                <legend id="start-date-legend" className="usa-legend">
                  Start Date
                </legend>
                <div className="usa-memorable-date">
                  <div className="usa-form-group usa-form-group--month margin-bottom-0">
                    <label
                      htmlFor="start-date-month"
                      className="usa-label"
                      aria-hidden="true"
                    >
                      MM
                    </label>
                    <input
                      className="usa-input usa-input-inline"
                      id="start-date-month"
                      aria-label="month, two digits"
                      aria-describedby="start-date-legend"
                      name="startDateMonth"
                      value={form.startDateMonth}
                      type="number"
                      min="1"
                      max="12"
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="usa-form-group usa-form-group--day margin-bottom-0">
                    <label
                      htmlFor="start-date-day"
                      className="usa-label"
                      aria-hidden="true"
                    >
                      DD
                    </label>
                    <input
                      className="usa-input usa-input-inline"
                      id="start-date-day"
                      name="startDateDay"
                      value={form.startDateDay}
                      aria-label="day, two digits"
                      aria-describedby="start-date-legend"
                      type="number"
                      min="1"
                      max="31"
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="usa-form-group usa-form-group--year margin-bottom-0">
                    <label
                      htmlFor="start-date-year"
                      className="usa-label"
                      aria-hidden="true"
                    >
                      YYYY
                    </label>
                    <input
                      className="usa-input usa-input-inline"
                      id="start-date-year"
                      aria-label="year, four digits"
                      aria-describedby="start-date-legend"
                      name="startDateYear"
                      value={form.startDateYear}
                      type="number"
                      min="1900"
                      max="2100"
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
              <Text
                className="usa-error-message"
                bind="validationErrors.startDate"
              />
            </div>

            <div className="usa-form-group">
              <fieldset className="start-time usa-fieldset margin-bottom-0">
                <legend id="start-time-legend" className="usa-legend">
                  Time <span className="usa-hint">(optional)</span>
                </legend>
                <input
                  className="usa-input usa-input-inline usa-input--small"
                  id="start-time"
                  aria-label="time"
                  aria-describedby="start-time-legend"
                  name="startTime"
                  value={form.startTime}
                  type="number"
                  min="1"
                  max="12"
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
                {['am', 'pm'].map(option => (
                  <div className="usa-radio usa-radio__inline" key={option}>
                    <input
                      id={`startTimeExtension-${option}`}
                      type="radio"
                      name="startTimeExtension"
                      aria-describedby="start-time-legend"
                      className="usa-radio__input"
                      value={option}
                      checked={form.startTimeExtension === option}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                    <label
                      htmlFor={`startTimeExtension-${option}`}
                      className="usa-radio__label"
                    >
                      {option}
                    </label>
                  </div>
                ))}
              </fieldset>
            </div>
          </div>

          <div className="button-box-container">
            <button type="submit" className="usa-button" onClick={() => {}}>
              Add Session
            </button>
            <button
              type="button"
              className="usa-button usa-button--outline"
              onClick={() => {}}
            >
              Cancel
            </button>
          </div>
        </section>
      </>
    );
  },
);
