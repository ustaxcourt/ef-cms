import { BigHeader } from '../BigHeader';
import { ErrorNotification } from '../ErrorNotification';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { LocationInformationForm } from './LocationInformationForm';
import { SessionAssignmentsForm } from './SessionAssignmentsForm';
import { SessionInformationForm } from './SessionInformationForm';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AddTrialSession = connect(
  {
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    showModal: state.showModal,
    submitTrialSessionSequence: sequences.submitTrialSessionSequence,
    updateTrialSessionFormDataSequence:
      sequences.updateTrialSessionFormDataSequence,
  },
  ({
    form,
    formCancelToggleCancelSequence,
    showModal,
    updateTrialSessionFormDataSequence,
    submitTrialSessionSequence,
  }) => {
    return (
      <>
        <BigHeader text="Trial Sessions" />

        <section className="usa-section grid-container DocumentDetail">
          <form
            role="form"
            aria-labelledby="start-case-header"
            noValidate
            onSubmit={e => {
              e.preventDefault();
              submitTrialSessionSequence();
            }}
            className="usa-form maxw-none"
          >
            {showModal === 'FormCancelModalDialogComponent' && (
              <FormCancelModalDialog onCancelSequence="closeModalAndReturnToTrialSessionsSequence" />
            )}
            <ErrorNotification />

            <h1>Add Trial Session</h1>
            <p>All fields required unless otherwise noted</p>

            <SessionInformationForm />
            <LocationInformationForm />
            <SessionAssignmentsForm />

            <h2 className="margin-top-4">Session Notes</h2>
            <div className="blue-container">
              <div className="usa-form-group margin-bottom-0">
                <label htmlFor="notes" className="usa-label">
                  Trial Session Notes{' '}
                  <span className="usa-hint">(optional)</span>
                </label>
                <textarea
                  className="usa-textarea"
                  id="notes"
                  name="notes"
                  value={form.notes}
                  maxLength="400"
                  onChange={e => {
                    updateTrialSessionFormDataSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </div>
            </div>

            <div className="button-box-container">
              <button type="submit" className="usa-button">
                Add Session
              </button>
              <button
                type="button"
                className="usa-button usa-button--outline"
                onClick={() => {
                  formCancelToggleCancelSequence();
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      </>
    );
  },
);
