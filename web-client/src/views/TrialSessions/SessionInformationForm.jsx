import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const SessionInformationForm = connect(
  {
    form: state.form,
    formattedTrialSessions: state.formattedTrialSessions,
    updateTrialSessionFormDataSequence:
      sequences.updateTrialSessionFormDataSequence,
    validateTrialSessionSequence: sequences.validateTrialSessionSequence,
    validationErrors: state.validationErrors,
  },
  ({
    form,
    formattedTrialSessions,
    updateTrialSessionFormDataSequence,
    validateTrialSessionSequence,
    validationErrors,
  }) => {
    return (
      <>
        <h2 className="margin-top-0">Session Information</h2>
        <div className="blue-container">
          <FormGroup errorText={validationErrors.startDate}>
            <fieldset className="start-date usa-fieldset margin-bottom-0">
              <legend className="usa-legend" id="start-date-legend">
                Start date
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
          </FormGroup>
          <FormGroup errorText={validationErrors.startTime}>
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
          </FormGroup>

          {formattedTrialSessions.showSwingSessionOption && (
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
              {formattedTrialSessions.showSwingSessionList && (
                <FormGroup errorText={validationErrors.swingSessionId}>
                  <label
                    className="usa-label"
                    htmlFor="swing-session-id"
                    id="swing-session-id-label"
                  >
                    Which Trial Session is This Associated With?
                  </label>
                  <select
                    aria-describedby="swing-session-id-label"
                    className={classNames(
                      'usa-select',
                      validationErrors.swingSessionId && 'usa-select--error',
                    )}
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
                    {formattedTrialSessions.sessionsByTerm.map(
                      (session, idx) => (
                        <option key={idx} value={session.trialSessionId}>
                          {session.trialLocation}
                        </option>
                      ),
                    )}
                  </select>
                </FormGroup>
              )}
            </>
          )}
          <FormGroup errorText={validationErrors.sessionType}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="usa-legend" id="session-type-legend">
                Session type
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
          </FormGroup>

          <FormGroup errorText={validationErrors.maxCases}>
            <label className="usa-label" htmlFor="max-cases">
              Number of cases allowed
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
          </FormGroup>
        </div>
      </>
    );
  },
);
