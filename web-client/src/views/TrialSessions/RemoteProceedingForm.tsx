import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
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
