import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SessionInformationForm = connect(
  {
    form: state.form,
    sessionsByTerm: state.formattedTrialSessions.sessionsByTerm,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateTrialSessionSequence: sequences.validateTrialSessionSequence,
    validationErrors: state.validationErrors,
  },
  ({
    form,
    sessionsByTerm,
    updateFormValueSequence,
    validateTrialSessionSequence,
    validationErrors,
  }) => {
    return (
      <>
        <h2 className="margin-top-4">Session Information</h2>
        <div className="blue-container">
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
                    name="month"
                    value={form.month || ''}
                    type="number"
                    min="1"
                    max="12"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                    onBlur={() => {
                      validateTrialSessionSequence();
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
                    name="day"
                    value={form.day || ''}
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
                    onBlur={() => {
                      validateTrialSessionSequence();
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
                    name="year"
                    value={form.year || ''}
                    type="number"
                    min="2019"
                    max="2200"
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                    onBlur={() => {
                      validateTrialSessionSequence();
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
              <div className="grid-row grid-gap-3">
                <div className="grid-col-3">
                  <input
                    className="usa-input usa-input-inline usa-input--medium"
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
                </div>
                <div className="grid-col-9">
                  <div className="radio-container">
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
                          className="usa-radio__label smaller-padding-right"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </fieldset>
          </div>

          <div className="usa-form-group">
            <div className="usa-checkbox">
              <input
                id="swing-session"
                type="checkbox"
                name="swingSession"
                className="usa-checkbox__input"
                checked={form.swingSession || false}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.checked,
                  });
                }}
              />
              <label htmlFor="swing-session" className="usa-checkbox__label">
                This is part of a Swing Session
              </label>
            </div>
          </div>

          {form.swingSession && form.term && (
            <div
              className={`usa-form-group ${
                validationErrors.swingSessionId ? 'usa-form-group--error ' : ''
              }`}
            >
              <label
                htmlFor="swing-session-id"
                id="swing-session-id-label"
                className="usa-label"
              >
                Which Trial Session is This Associated With?
              </label>
              <select
                name="swingSessionId"
                id="swing-session-id"
                aria-describedby="swing-session-id-label"
                className={`usa-select ${
                  validationErrors.swingSessionId ? 'usa-select--error' : ''
                }`}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateTrialSessionSequence();
                }}
                value={form.swingSessionId || ''}
              >
                <option value="">- Select -</option>
                {sessionsByTerm.map((session, idx) => (
                  <option value={session.trialSessionId} key={idx}>
                    {session.trialLocation}
                  </option>
                ))}
              </select>
              <Text
                className="usa-error-message"
                bind="validationErrors.swingSessionId"
              />
            </div>
          )}

          <div
            className={`usa-form-group ${
              validationErrors.sessionType ? 'usa-form-group--error' : ''
            }`}
          >
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend id="session-type-legend" className="usa-legend">
                Session Type
              </legend>
              {['Regular', 'Small', 'Hybrid', 'Special', 'Motion/Hearing'].map(
                option => (
                  <div className="usa-radio" key={option}>
                    <input
                      id={`session-type-${option}`}
                      type="radio"
                      aria-describedby="session-type-legend"
                      name="sessionType"
                      className="usa-radio__input"
                      value={option}
                      checked={form.sessionType === option}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                        validateTrialSessionSequence();
                      }}
                    />
                    <label
                      htmlFor={`session-type-${option}`}
                      className="usa-radio__label"
                    >
                      {option}
                    </label>
                  </div>
                ),
              )}
            </fieldset>
            <Text
              className="usa-error-message"
              bind="validationErrors.sessionType"
            />
          </div>

          <div
            className={`usa-form-group margin-bottom-0 ${
              validationErrors.maxCases ? 'usa-form-group--error' : ''
            }`}
          >
            <label htmlFor="max-cases" className="usa-label">
              Number of Cases Allowed
            </label>
            <input
              id="max-cases"
              type="text"
              name="maxCases"
              className="usa-input usa-input--small"
              autoCapitalize="none"
              value={form.maxCases || ''}
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
              onBlur={() => {
                validateTrialSessionSequence();
              }}
            />
            <Text
              className="usa-error-message"
              bind="validationErrors.maxCases"
            />
          </div>
        </div>
      </>
    );
  },
);
