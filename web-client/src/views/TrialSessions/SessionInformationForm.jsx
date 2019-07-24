import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SessionInformationForm = connect(
  {
    form: state.form,
    trialSessionHelper: state.formattedTrialSessions,
    updateTrialSessionFormDataSequence:
      sequences.updateTrialSessionFormDataSequence,
    validateTrialSessionSequence: sequences.validateTrialSessionSequence,
    validationErrors: state.validationErrors,
  },
  ({
    form,
    trialSessionHelper,
    updateTrialSessionFormDataSequence,
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
              <legend className="usa-legend" id="start-date-legend">
                Start Date
              </legend>
              <div className="usa-memorable-date">
                <div className="usa-form-group usa-form-group--month margin-bottom-0">
                  <input
                    aria-describedby="start-date-legend"
                    aria-label="month, two digits"
                    className="usa-input usa-input-inline"
                    id="start-date-month"
                    max="12"
                    min="1"
                    name="month"
                    placeholder="MM"
                    type="number"
                    value={form.month || ''}
                    onBlur={() => {
                      validateTrialSessionSequence();
                    }}
                    onChange={e => {
                      updateTrialSessionFormDataSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group--day margin-bottom-0">
                  <input
                    aria-describedby="start-date-legend"
                    aria-label="day, two digits"
                    className="usa-input usa-input-inline"
                    id="start-date-day"
                    max="31"
                    min="1"
                    name="day"
                    placeholder="DD"
                    type="number"
                    value={form.day || ''}
                    onBlur={() => {
                      validateTrialSessionSequence();
                    }}
                    onChange={e => {
                      updateTrialSessionFormDataSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group--year margin-bottom-0">
                  <input
                    aria-describedby="start-date-legend"
                    aria-label="year, four digits"
                    className="usa-input usa-input-inline"
                    id="start-date-year"
                    max="2200"
                    min="2019"
                    name="year"
                    placeholder="YYYY"
                    type="number"
                    value={form.year || ''}
                    onBlur={() => {
                      validateTrialSessionSequence();
                    }}
                    onChange={e => {
                      updateTrialSessionFormDataSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </div>
              </div>
            </fieldset>
            <Text
              bind="validationErrors.startDate"
              className="usa-error-message"
            />
          </div>
          <div
            className={`usa-form-group ${
              validationErrors.startTime ? 'usa-form-group--error' : ''
            }`}
          >
            <fieldset className="start-time usa-fieldset margin-bottom-0">
              <legend className="usa-legend" id="start-time-legend">
                Time <span className="usa-hint">(optional)</span>
              </legend>
              <div className="grid-row grid-gap-6">
                <div className="grid-col-3 ustc-time-of-day">
                  <div className="usa-form-group ustc-time-of-day--hour">
                    <input
                      aria-describedby="start-time-legend"
                      aria-label="hour"
                      className="usa-input usa-input-inline"
                      id="start-time-hours"
                      max="12"
                      min="1"
                      name="startTimeHours"
                      placeholder="10"
                      type="number"
                      value={form.startTimeHours || ''}
                      onChange={e => {
                        updateTrialSessionFormDataSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="usa-form-group ustc-time-of-day--minute">
                    <input
                      aria-describedby="start-time-legend"
                      aria-label="minutes"
                      className="usa-input usa-input-inline"
                      id="start-time-minutes"
                      max="59"
                      min="0"
                      name="startTimeMinutes"
                      placeholder="00"
                      type="number"
                      value={form.startTimeMinutes || ''}
                      onChange={e => {
                        updateTrialSessionFormDataSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
                <div className="grid-col-6 ustc-time-of-day">
                  <div className="ustc-time-of-day--am-pm">
                    {['am', 'pm'].map(option => (
                      <div className="usa-radio usa-radio__inline" key={option}>
                        <input
                          aria-describedby="start-time-legend"
                          checked={form.startTimeExtension === option}
                          className="usa-radio__input"
                          id={`startTimeExtension-${option}`}
                          name="startTimeExtension"
                          type="radio"
                          value={option}
                          onBlur={() => {
                            validateTrialSessionSequence();
                          }}
                          onChange={e => {
                            updateTrialSessionFormDataSequence({
                              key: e.target.name,
                              value: e.target.value,
                            });
                          }}
                        />
                        <label
                          aria-label={option.toUpperCase()}
                          className="usa-radio__label smaller-padding-right"
                          htmlFor={`startTimeExtension-${option}`}
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </fieldset>
            <Text
              bind="validationErrors.startTime"
              className="usa-error-message"
            />
          </div>
          {trialSessionHelper.showSwingSessionOption && (
            <>
              <div className="usa-form-group">
                <div className="usa-checkbox">
                  <input
                    checked={form.swingSession || false}
                    className="usa-checkbox__input"
                    id="swing-session"
                    name="swingSession"
                    type="checkbox"
                    onChange={e => {
                      updateTrialSessionFormDataSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                    }}
                  />
                  <label
                    className="usa-checkbox__label"
                    htmlFor="swing-session"
                  >
                    This is part of a Swing Session
                  </label>
                </div>
              </div>
              {trialSessionHelper.showSwingSessionList && (
                <div
                  className={`usa-form-group ${
                    validationErrors.swingSessionId
                      ? 'usa-form-group--error '
                      : ''
                  }`}
                >
                  <label
                    className="usa-label"
                    htmlFor="swing-session-id"
                    id="swing-session-id-label"
                  >
                    Which Trial Session is This Associated With?
                  </label>
                  <select
                    aria-describedby="swing-session-id-label"
                    className={`usa-select ${
                      validationErrors.swingSessionId ? 'usa-select--error' : ''
                    }`}
                    id="swing-session-id"
                    name="swingSessionId"
                    value={form.swingSessionId || ''}
                    onChange={e => {
                      updateTrialSessionFormDataSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                      validateTrialSessionSequence();
                    }}
                  >
                    <option value="">- Select -</option>
                    {trialSessionHelper.sessionsByTerm.map((session, idx) => (
                      <option key={idx} value={session.trialSessionId}>
                        {session.trialLocation}
                      </option>
                    ))}
                  </select>
                  <Text
                    bind="validationErrors.swingSessionId"
                    className="usa-error-message"
                  />
                </div>
              )}
            </>
          )}
          <div
            className={`usa-form-group ${
              validationErrors.sessionType ? 'usa-form-group--error' : ''
            }`}
          >
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="usa-legend" id="session-type-legend">
                Session Type
              </legend>
              {['Regular', 'Small', 'Hybrid', 'Special', 'Motion/Hearing'].map(
                option => (
                  <div className="usa-radio" key={option}>
                    <input
                      aria-describedby="session-type-legend"
                      checked={form.sessionType === option}
                      className="usa-radio__input"
                      id={`session-type-${option}`}
                      name="sessionType"
                      type="radio"
                      value={option}
                      onChange={e => {
                        updateTrialSessionFormDataSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                        validateTrialSessionSequence();
                      }}
                    />
                    <label
                      className="usa-radio__label"
                      htmlFor={`session-type-${option}`}
                    >
                      {option}
                    </label>
                  </div>
                ),
              )}
            </fieldset>
            <Text
              bind="validationErrors.sessionType"
              className="usa-error-message"
            />
          </div>
          <div
            className={`usa-form-group margin-bottom-0 ${
              validationErrors.maxCases ? 'usa-form-group--error' : ''
            }`}
          >
            <label className="usa-label" htmlFor="max-cases">
              Number of Cases Allowed
            </label>
            <input
              autoCapitalize="none"
              className="usa-input usa-input--small"
              id="max-cases"
              name="maxCases"
              type="text"
              value={form.maxCases || ''}
              onBlur={() => {
                validateTrialSessionSequence();
              }}
              onChange={e => {
                updateTrialSessionFormDataSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
            <Text
              bind="validationErrors.maxCases"
              className="usa-error-message"
            />
          </div>
        </div>
      </>
    );
  },
);
