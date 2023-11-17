import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { ErrorNotification } from '../ErrorNotification';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { LocationInformationForm } from './LocationInformationForm';
import { SessionAssignmentsForm } from './SessionAssignmentsForm';
import { SessionInformationForm } from './SessionInformationForm';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AddTrialSession = connect(
  {
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    showModal: state.modal.showModal,
    submitTrialSessionSequence: sequences.submitTrialSessionSequence,
    updateTrialSessionFormDataSequence:
      sequences.updateTrialSessionFormDataSequence,
  },
  function AddTrialSession({
    form,
    formCancelToggleCancelSequence,
    showModal,
    submitTrialSessionSequence,
    updateTrialSessionFormDataSequence,
  }) {
    return (
      <>
        <BigHeader text="Create Trial Session" />

        <section className="usa-section grid-container DocumentDetail">
          <div
            noValidate
            aria-labelledby="start-case-header"
            className="usa-form maxw-none"
            role="form"
          >
            {showModal === 'FormCancelModalDialog' && (
              <FormCancelModalDialog onCancelSequence="closeModalAndReturnToTrialSessionsSequence" />
            )}
            <ErrorNotification />

            <p className="margin-bottom-2 required-statement margin-top-05">
              All fields required unless otherwise noted
            </p>

            <SessionInformationForm addingTrialSession={true} />
            <LocationInformationForm />
            <SessionAssignmentsForm />

            <h2 className="margin-top-4">Session Notes</h2>
            <div className="blue-container margin-bottom-2">
              <div className="usa-form-group margin-bottom-0">
                <label className="usa-label" htmlFor="notes">
                  Trial session notes{' '}
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

            <Button
              data-testid="submit-trial-session"
              id="submit-trial-session"
              type="button"
              onClick={() => {
                submitTrialSessionSequence();
              }}
            >
              Add Session
            </Button>
            <Button
              link
              id="cancel"
              type="button"
              onClick={() => {
                formCancelToggleCancelSequence();
              }}
            >
              Cancel
            </Button>
          </div>
        </section>
      </>
    );
  },
);

AddTrialSession.displayName = 'AddTrialSession';
