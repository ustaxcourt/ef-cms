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
    submitTrialSessionSequence,
    updateTrialSessionFormDataSequence,
  }) => {
    return (
      <>
        <BigHeader text="Trial Sessions" />

        <section className="usa-section grid-container DocumentDetail">
          <form
            noValidate
            aria-labelledby="start-case-header"
            className="usa-form maxw-none"
            role="form"
            onSubmit={e => {
              e.preventDefault();
              submitTrialSessionSequence();
            }}
          >
            {showModal === 'FormCancelModalDialog' && (
              <FormCancelModalDialog onCancelSequence="closeModalAndReturnToTrialSessionsSequence" />
            )}
            <ErrorNotification />

            <p className="margin-bottom-5 required-statement margin-top-05 ">
              *All fields required unless otherwise noted
            </p>

            <SessionInformationForm />
            <LocationInformationForm />
            <SessionAssignmentsForm />

            <h2 className="margin-top-4">Session Notes</h2>
            <div className="blue-container">
              <div className="usa-form-group margin-bottom-0">
                <label className="usa-label" htmlFor="notes">
                  Trial Session Notes{' '}
                  <span className="usa-hint">(optional)</span>
                </label>
                <textarea
                  className="usa-textarea"
                  id="notes"
                  maxLength="400"
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

            <div className="button-box-container">
              <button className="usa-button" type="submit">
                Add Session
              </button>
              <button
                className="usa-button usa-button--outline"
                type="button"
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
