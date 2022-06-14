import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const SessionInformationForm = connect(
  {
    TRIAL_SESSION_SCOPE_TYPES: state.constants.TRIAL_SESSION_SCOPE_TYPES,
    addTrialSessionInformationHelper: state.addTrialSessionInformationHelper,
    form: state.form,
    formattedTrialSessions: state.formattedTrialSessions,
    updateTrialSessionFormDataSequence:
      sequences.updateTrialSessionFormDataSequence,
    validateTrialSessionSequence: sequences.validateTrialSessionSequence,
    validationErrors: state.validationErrors,
  },
  function SessionInformationForm({
    addingTrialSession,
    addTrialSessionInformationHelper,
    form,
    formattedTrialSessions,
    TRIAL_SESSION_SCOPE_TYPES,
    updateTrialSessionFormDataSequence,
    validateTrialSessionSequence,
    validationErrors,
  }) {
    return (
      <>
        <h2 className="margin-top-0">Session Information</h2>
        <div className="blue-container">
          {addingTrialSession &&
            addTrialSessionInformationHelper.FEATURE_canDisplayStandaloneRemote && (
              <div className="margin-bottom-5">
                <legend className="usa-legend" id="session-scope-legend">
                  Session scope
                </legend>
                {Object.entries(TRIAL_SESSION_SCOPE_TYPES).map(
                  ([key, value]) => (
                    <div className="usa-radio usa-radio__inline" key={key}>
                      <input
                        aria-describedby="session-scope"
                        checked={form.sessionScope === value}
                        className="usa-radio__input"
                        id={`${key}-sessionScope`}
                        name="sessionScope"
                        type="radio"
                        value={value}
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
                        aria-label={value}
                        className="smaller-padding-right usa-radio__label"
                        htmlFor={`${key}-sessionScope`}
                        id={`${key}-session-scope-label`}
                      >
                        {value}
                      </label>
                    </div>
                  ),
                )}
              </div>
            )}

          <div className="grid-row grid-gap-6">
            <div className="grid-col-12 tablet:grid-col-6 desktop:grid-col-3">
              <DateInput
                errorText={validationErrors.startDate}
                hintText={
                  addTrialSessionInformationHelper.isStandaloneSession
                    ? 'All standalone remote sessions begin at 1 p.m. ET.'
                    : undefined
                }
                id="start-date"
                label="Start date"
                names={{
                  day: 'startDateDay',
                  month: 'startDateMonth',
                  year: 'startDateYear',
                }}
                placeholder="MM/DD/YYYY"
                showDateHint={false}
                titleHintText="(MM/DD/YYYY)"
                useHintNoWrap={true}
                values={{
                  day: form.startDateDay,
                  month: form.startDateMonth,
                  year: form.startDateYear,
                }}
                onBlur={validateTrialSessionSequence}
                onChange={updateTrialSessionFormDataSequence}
              />
            </div>

            {!addTrialSessionInformationHelper.isStandaloneSession && (
              <div className="grid-col-12 tablet:grid-col-9">
                <FormGroup errorText={validationErrors.startTime}>
                  <fieldset className="start-time usa-fieldset margin-bottom-0">
                    <legend className="usa-legend" id="start-time-legend">
                      Time <span className="usa-hint">(optional)</span>
                    </legend>
                    <div className="ustc-time-of-day">
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
                      <div className="ustc-time-of-day">
                        <div className="ustc-time-of-day--am-pm margin-left-2">
                          {['am', 'pm'].map(option => (
                            <div
                              className="usa-radio usa-radio__inline"
                              key={option}
                            >
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
                                className="smaller-padding-right usa-radio__label"
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
              </div>
            )}
          </div>

          <div className="grid-row grid-gap-6">
            <div className="grid-col-12 tablet:grid-col-6 desktop:grid-col-3">
              <DateInput
                errorText={validationErrors.estimatedEndDate}
                hintText={
                  addTrialSessionInformationHelper.isStandaloneSession
                    ? 'All standalone remote sessions begin at 1 p.m. ET.'
                    : undefined
                }
                id="estimated-end-date"
                label="Estimated end date"
                names={{
                  day: 'estimatedEndDateDay',
                  month: 'estimatedEndDateMonth',
                  year: 'estimatedEndDateYear',
                }}
                optional="true"
                placeholder="MM/DD/YYYY"
                showDateHint={false}
                useHintNoWrap={true}
                values={{
                  day: form.estimatedEndDateDay,
                  month: form.estimatedEndDateMonth,
                  year: form.estimatedEndDateYear,
                }}
                onBlur={validateTrialSessionSequence}
                onChange={updateTrialSessionFormDataSequence}
              />
            </div>
          </div>

          {formattedTrialSessions.showSwingSessionOption &&
            !addTrialSessionInformationHelper.isStandaloneSession && (
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
                      This is part of a Swing session
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
                      {formattedTrialSessions.sessionsByTerm.map(session => (
                        <option
                          key={session.trialSessionId}
                          value={session.trialSessionId}
                        >
                          {session.trialLocation}
                        </option>
                      ))}
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
              {addTrialSessionInformationHelper.sessionTypes.map(option => (
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
              ))}
            </fieldset>
          </FormGroup>
          {!addTrialSessionInformationHelper.isStandaloneSession && (
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
          )}
        </div>
      </>
    );
  },
);
