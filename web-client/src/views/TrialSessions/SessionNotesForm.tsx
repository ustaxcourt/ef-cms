import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

type SessionNotesFormProps = { addingTrialSession: boolean };

const SessionNotesFormDeps = {
  form: state.form,
  formattedTrialSessionDetails: state.formattedTrialSessionDetails,
  updateTrialSessionFormDataSequence:
    sequences.updateTrialSessionFormDataSequence,
};

export const SessionNotesForm = connect<
  SessionNotesFormProps,
  typeof SessionNotesFormDeps
>(
  SessionNotesFormDeps,
  function SessionNotesForm({
    addingTrialSession,
    form,
    formattedTrialSessionDetails,
    updateTrialSessionFormDataSequence,
  }) {
    return (
      <>
        <h2 className="margin-top-4">Session Notes</h2>
        <div className="blue-container margin-bottom-2">
          <div className="usa-form-group margin-bottom-0">
            <label className="usa-label" htmlFor="notes">
              Trial session notes <span className="usa-hint">(optional)</span>
            </label>
            <textarea
              className="usa-textarea textarea-resize-vertical"
              disabled={
                !addingTrialSession &&
                formattedTrialSessionDetails.canEditOngoingSession
              }
              id="notes"
              maxLength={400}
              name="notes"
              value={form.notes}
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

SessionNotesForm.displayName = 'SessionNotesForm';
