import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const RemoteProceedingForm = connect(
  {
    form: state.form,
    updateTrialSessionFormDataSequence:
      sequences.updateTrialSessionFormDataSequence,
  },
  ({ form, updateTrialSessionFormDataSequence }) => {
    return (
      <div>
        <div className="usa-form-group">
          <label className="usa-label" htmlFor="meeting-id">
            Meeting ID <span className="usa-hint">(optional)</span>
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            data-testid="trial-session-meeting-id"
            id="meeting-id"
            name="meetingId"
            type="text"
            value={form.meetingId || ''}
            onChange={e => {
              updateTrialSessionFormDataSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </div>

        <div className="usa-form-group">
          <label className="usa-label" htmlFor="password">
            Password <span className="usa-hint">(optional)</span>
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            data-testid="trial-session-password"
            id="password"
            name="password"
            type="text"
            value={form.password || ''}
            onChange={e => {
              updateTrialSessionFormDataSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </div>

        <div className="usa-form-group">
          <label
            className="usa-label margin-bottom-0"
            htmlFor="join-phone-number"
          >
            Join by telephone <span className="usa-hint">(optional)</span>
          </label>
          <span className="usa-hint">
            Enter the phone number parties will use to join the remote
            proceedings by phone.
          </span>
          <input
            autoCapitalize="none"
            className="usa-input"
            data-testid="trial-session-join-phone-number"
            id="join-phone-number"
            name="joinPhoneNumber"
            type="text"
            value={form.joinPhoneNumber || ''}
            onChange={e => {
              updateTrialSessionFormDataSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          />
        </div>

        <div className="usa-form-group">
          <label className="usa-label" htmlFor="chambers-phone-number">
            Chambers phone number <span className="usa-hint">(optional)</span>
          </label>
          <input
            autoCapitalize="none"
            className="usa-input"
            data-testid="trial-session-chambers-phone-number"
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
      </div>
    );
  },
);

RemoteProceedingForm.displayName = 'RemoteProceedingForm';
