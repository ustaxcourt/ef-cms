import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const SessionAssignmentsForm = connect(
  {
    TRIAL_SESSION_PROCEEDING_TYPES:
      state.constants.TRIAL_SESSION_PROCEEDING_TYPES,
    form: state.form,
    judges: state.judges,
    sessionAssignmentHelper: state.sessionAssignmentHelper,
    updateTrialSessionFormDataSequence:
      sequences.updateTrialSessionFormDataSequence,
  },
  function SessionAssignmentsForm({
    form,
    judges,
    sessionAssignmentHelper,
    TRIAL_SESSION_PROCEEDING_TYPES,
    updateTrialSessionFormDataSequence,
  }) {
    return (
      <>
        <h2 className="margin-top-4">Session Assignments</h2>
        <div className="blue-container">
          <div className="usa-form-group">
            <label className="usa-label" htmlFor="judgeId" id="judge-label">
              Judge <span className="usa-hint">(optional)</span>
            </label>
            <select
              aria-describedby="judge-label"
              className="usa-select"
              data-cy="trial-session-judge"
              id="judgeId"
              name="judgeId"
              value={form.judgeId || ''}
              onChange={e => {
                updateTrialSessionFormDataSequence({
                  key: e.target.name,
                  value:
                    judges.find(judge => judge.userId === e.target.value) || '',
                });
              }}
            >
              <option value="">- Select -</option>
              {judges.map(judge => (
                <option key={judge.name} value={judge.userId}>
                  {judge.name}
                </option>
              ))}
            </select>
          </div>
          {form.proceedingType === TRIAL_SESSION_PROCEEDING_TYPES.inPerson && (
            <div className="usa-form-group">
              <label className="usa-label" htmlFor="chambers-phone-number">
                Chambers phone number{' '}
                <span className="usa-hint">(optional)</span>
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                id="chambers-phone-number"
                name="chambersPhoneNumber"
                type="text"
                value={form.chambersPhoneNumber || ''}
                onChange={e => {
                  updateTrialSessionFormDataSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </div>
          )}
          <div className="grid-row">
            <div className="usa-form-group desktop:grid-col-6 desktop:margin-right-3 no-shrink">
              <label
                className="usa-label"
                htmlFor="trial-clerk"
                id="trial-clerk-label"
              >
                Trial clerk <span className="usa-hint">(optional)</span>
              </label>
              <select
                aria-describedby="trial-clerk-label"
                className="usa-select"
                data-cy="trial-session-trial-clerk"
                id="trial-clerk"
                name="trialClerkId"
                value={form.trialClerkId || ''}
                onChange={e => {
                  updateTrialSessionFormDataSequence({
                    key: e.target.name,
                    value: sessionAssignmentHelper.formattedTrialClerks.find(
                      trialClerk => trialClerk.userId === e.target.value,
                    ),
                  });
                }}
              >
                <option value="">- Select -</option>
                {sessionAssignmentHelper.formattedTrialClerks.map(
                  trialClerk => (
                    <option key={trialClerk.userId} value={trialClerk.userId}>
                      {trialClerk.name}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div
              className="usa-form-group desktop:grid-col-6 no-shrink"
              hidden={!sessionAssignmentHelper.showAlternateTrialClerkField}
            >
              <label className="usa-label" htmlFor="alternate-trial-clerk-name">
                Alternate trial clerk name{' '}
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                data-cy="trial-session-trial-clerk-alternate"
                id="alternate-trial-clerk-name"
                name="alternateTrialClerkName"
                type="text"
                value={form.alternateTrialClerkName || ''}
                onChange={e => {
                  updateTrialSessionFormDataSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </div>
          </div>
          <div className="usa-form-group">
            <label className="usa-label" htmlFor="court-reporter">
              Court reporter <span className="usa-hint">(optional)</span>
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
              data-cy="trial-session-court-reporter"
              id="court-reporter"
              name="courtReporter"
              type="text"
              value={form.courtReporter || ''}
              onChange={e => {
                updateTrialSessionFormDataSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </div>

          <div className="usa-form-group margin-bottom-0">
            <label className="usa-label" htmlFor="irs-calendar-administrator">
              IRS calendar administrator{' '}
              <span className="usa-hint">(optional)</span>
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
              data-cy="trial-session-irs-calendar-administrator"
              id="irs-calendar-administrator"
              name="irsCalendarAdministrator"
              type="text"
              value={form.irsCalendarAdministrator || ''}
              onChange={e => {
                updateTrialSessionFormDataSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </div>
        </div>
      </>
    );
  },
);

SessionAssignmentsForm.displayName = 'SessionAssignmentsForm';
