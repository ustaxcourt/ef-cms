import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SessionAssignmentsForm = connect(
  {
    form: state.form,
    updateTrialSessionFormDataSequence:
      sequences.updateTrialSessionFormDataSequence,
  },
  ({ form, updateTrialSessionFormDataSequence }) => {
    return (
      <>
        <h2 className="margin-top-4">Session Assignments</h2>
        <div className="blue-container">
          <div className="usa-form-group">
            <label className="usa-label" htmlFor="judge" id="judge-label">
              Judge <span className="usa-hint">(optional)</span>
            </label>
            <select
              aria-describedby="judge-label"
              className="usa-select"
              id="judge"
              name="judge"
              value={form.judge || ''}
              onChange={e => {
                updateTrialSessionFormDataSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            >
              <option value="">- Select -</option>
              {/* hardcoding these for #1191 - will be dynamic at some point */}
              <option value="Judge Armen">Judge Armen</option>
              <option value="Judge Ashford">Judge Ashford</option>
              <option value="Judge Buch">Judge Buch</option>
              <option value="Judge Carluzzo">Judge Carluzzo</option>
              <option value="Judge Cohen">Judge Cohen</option>
              <option value="Judge Colvin">Judge Colvin</option>
              <option value="Judge Copeland">Judge Copeland</option>
              <option value="Judge Foley">Judge Foley</option>
              <option value="Judge Gale">Judge Gale</option>
              <option value="Judge Gerber">Judge Gerber</option>
              <option value="Judge Goeke">Judge Goeke</option>
              <option value="Judge Gustafson">Judge Gustafson</option>
              <option value="Judge Guy">Judge Guy</option>
              <option value="Judge Halpern">Judge Halpern</option>
              <option value="Judge Holmes">Judge Holmes</option>
              <option value="Judge Jacobs">Judge Jacobs</option>
              <option value="Judge Kerrigan">Judge Kerrigan</option>
              <option value="Judge Lauber">Judge Lauber</option>
              <option value="Judge Leyden">Judge Leyden</option>
              <option value="Judge Marvel">Judge Marvel</option>
              <option value="Judge Morrison">Judge Morrison</option>
              <option value="Judge Negas">Judge Negas</option>
              <option value="Judge Panuthos">Judge Panuthos</option>
              <option value="Judge Paris">Judge Paris</option>
              <option value="Judge Pugh">Judge Pugh</option>
              <option value="Judge Ruwe">Judge Ruwe</option>
              <option value="Judge Thorton">Judge Thorton</option>
              <option value="Judge Urda">Judge Urda</option>
              <option value="Judge Vasquez">Judge Vasquez</option>
              <option value="Judge Wells">Judge Wells</option>
            </select>
          </div>

          <div className="usa-form-group">
            <label
              className="usa-label"
              htmlFor="trial-clerk"
              id="trial-clerk-label"
            >
              Trial Clerk <span className="usa-hint">(optional)</span>
            </label>
            <select
              aria-describedby="trial-clerk-label"
              className="usa-select"
              id="trial-clerk"
              name="trialClerk"
              value={form.trialClerk || ''}
              onChange={e => {
                updateTrialSessionFormDataSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            >
              <option value="">- Select -</option>
              {/* hardcoding these for #1191 - will be dynamic at some point */}
              <option value="Bob Barker">Bob Barker</option>
              <option value="Bill Dance">Bill Dance</option>
              <option value="Jerry Seinfeld">Jerry Seinfeld</option>
            </select>
          </div>

          <div className="usa-form-group">
            <label className="usa-label" htmlFor="court-reporter">
              Court Reporter <span className="usa-hint">(optional)</span>
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
              IRS Calendar Administrator{' '}
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
