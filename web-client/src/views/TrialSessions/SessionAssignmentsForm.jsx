import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SessionAssignmentsForm = connect(
  {
    form: state.form,
    judges: state.judges,
    trialClerks: state.trialClerks,
    updateTrialSessionFormDataSequence:
      sequences.updateTrialSessionFormDataSequence,
  },
  ({ form, judges, trialClerks, updateTrialSessionFormDataSequence }) => {
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
              id="judgeId"
              name="judgeId"
              value={form.judgeId || ''}
              onChange={e => {
                updateTrialSessionFormDataSequence({
                  key: e.target.name,
                  value: judges.find(judge => judge.userId === e.target.value),
                });
              }}
            >
              <option value="">- Select -</option>
              {judges.map((judge, idx) => (
                <option key={idx} value={judge.userId}>
                  {judge.name}
                </option>
              ))}
            </select>
          </div>

          <div className="usa-form-group">
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
              id="trial-clerk"
              name="trialClerkId"
              value={form.trialClerkId || ''}
              onChange={e => {
                updateTrialSessionFormDataSequence({
                  key: e.target.name,
                  value: trialClerks.find(
                    trialClerk => trialClerk.userId === e.target.value,
                  ),
                });
              }}
            >
              <option value="">- Select -</option>
              {trialClerks.map((trialClerk, idx) => (
                <option key={idx} value={trialClerk.userId}>
                  {trialClerk.name}
                </option>
              ))}
            </select>
          </div>

          <div className="usa-form-group">
            <label className="usa-label" htmlFor="court-reporter">
              Court reporter <span className="usa-hint">(optional)</span>
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
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
