import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { SelectSearch } from '@web-client/ustc-ui/Select/SelectSearch';
import { connect } from '@web-client/presenter/shared.cerebral';
import {
  irsCalendarAdminInfoOnChange,
  onInputChange,
} from '@web-client/ustc-ui/Utils/documentTypeSelectHelper';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const SessionAssignmentsForm = connect(
  {
    TRIAL_SESSION_PROCEEDING_TYPES:
      state.constants.TRIAL_SESSION_PROCEEDING_TYPES,
    form: state.form,
    getAllIrsPractitionersForSelectHelper:
      state.getAllIrsPractitionersForSelectHelper,
    judges: state.judges,
    sessionAssignmentHelper: state.sessionAssignmentHelper,
    updateScreenMetadataSequence: sequences.updateScreenMetadataSequence,
    updateTrialSessionFormDataSequence:
      sequences.updateTrialSessionFormDataSequence,
  },
  function SessionAssignmentsForm({
    form,
    getAllIrsPractitionersForSelectHelper,
    judges,
    sessionAssignmentHelper,
    TRIAL_SESSION_PROCEEDING_TYPES,
    updateScreenMetadataSequence,
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
              data-testid="trial-session-judge"
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
                data-testid="edit-trial-session-chambers-phone-number"
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
                data-testid="trial-session-trial-clerk"
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
                data-testid="trial-session-trial-clerk-alternate"
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
              data-testid="trial-session-court-reporter"
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

          <div className="usa-form-group">
            <FormGroup>
              <label
                className="usa-label"
                htmlFor="irs-calendar-administrator-info-name"
                id="irs-calendar-administrator-info-search-label"
              >
                Search for IRS calendar administrator name{' '}
                <span className="usa-hint">(optional)</span>
              </label>

              <SelectSearch
                aria-label="irs-calendar-administrator-info-search-label"
                id="irs-calendar-administrator-info-search"
                name="irsCalendarAdministratorInfoSearch "
                options={
                  getAllIrsPractitionersForSelectHelper.irsPractitionersContactInfo
                }
                placeholder="- Enter name -"
                onChange={(inputValue, { action }) => {
                  irsCalendarAdminInfoOnChange({
                    action,
                    inputValue,
                    updateTrialSessionFormDataSequence,
                  });
                  return true;
                }}
                onInputChange={(inputText, { action }) => {
                  onInputChange({
                    action,
                    inputText,
                    updateSequence: updateScreenMetadataSequence,
                  });
                }}
              />
            </FormGroup>
          </div>

          <div className="usa-form-group">
            <label
              className="usa-label"
              htmlFor="irs-calendar-administrator-info-name"
            >
              IRS calendar administrator name{' '}
              <span className="usa-hint">(optional)</span>
            </label>
            <input
              autoCapitalize="none"
              className="usa-input"
              data-testid="irs-calendar-administrator-info-name"
              id="irs-calendar-administrator-info-name"
              name="irsCalendarAdministratorInfo.name"
              type="text"
              value={form.irsCalendarAdministratorInfo?.name || ''}
              onChange={e => {
                updateTrialSessionFormDataSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
          </div>

          <div className="usa-form-group grid-row">
            <div className="usa-form-group desktop:grid-col-6 desktop:no-shrink usa-width-one-hundred usa-width-five-percent">
              <label
                className="usa-label"
                htmlFor="irs-calendar-administrator-info-email"
              >
                Email <span className="usa-hint">(optional)</span>
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                data-testid="irs-calendar-administrator-info-email"
                id="irs-calendar-administrator-info-email"
                name="irsCalendarAdministratorInfo.email"
                type="text"
                value={form.irsCalendarAdministratorInfo?.email || ''}
                onChange={e => {
                  updateTrialSessionFormDataSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </div>
            <div className="usa-form-group desktop:grid-col-6 desktop:no-shrink desktop:padding-left-2">
              <label
                className="usa-label"
                htmlFor="irs-calendar-administrator-info-phone"
              >
                Phone number <span className="usa-hint">(optional)</span>
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                data-testid="irs-calendar-administrator-info-phone"
                id="irs-calendar-administrator-info-phone"
                name="irsCalendarAdministratorInfo.phone"
                type="text"
                value={form.irsCalendarAdministratorInfo?.phone || ''}
                onChange={e => {
                  updateTrialSessionFormDataSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </div>
          </div>
        </div>
      </>
    );
  },
);

SessionAssignmentsForm.displayName = 'SessionAssignmentsForm';
