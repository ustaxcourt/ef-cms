import { BigHeader } from '../BigHeader';
import { Button } from '../../ustc-ui/Button/Button';
import { ErrorNotification } from '../ErrorNotification';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { LocationInformationForm } from './LocationInformationForm';
import { SessionAssignmentsForm } from './SessionAssignmentsForm';
import { SessionInformationForm } from './SessionInformationForm';
import { SessionNotesForm } from './SessionNotesForm';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AddTrialSession = connect(
  {
    closeModalAndReturnToTrialSessionsSequence:
      sequences.closeModalAndReturnToTrialSessionsSequence,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    showModal: state.modal.showModal,
    submitTrialSessionSequence: sequences.submitTrialSessionSequence,
  },
  function AddTrialSession({
    closeModalAndReturnToTrialSessionsSequence,
    formCancelToggleCancelSequence,
    showModal,
    submitTrialSessionSequence,
  }) {
    return (
      <>
        <BigHeader text="Create Trial Session" />

        <section className="usa-section grid-container DocumentDetail">
          <form
            noValidate
            aria-labelledby="start-case-header"
            className="usa-form maxw-none"
          >
            {showModal === 'FormCancelModalDialog' && (
              <FormCancelModalDialog
                onCancelSequence={closeModalAndReturnToTrialSessionsSequence}
              />
            )}
            <ErrorNotification />

            <p className="margin-bottom-2 required-statement margin-top-05">
              All fields required unless otherwise noted
            </p>

            <SessionInformationForm addingTrialSession={true} />
            <LocationInformationForm addingTrialSession={true} />
            <SessionAssignmentsForm addingTrialSession={true} />
            <SessionNotesForm addingTrialSession={true} />

            <div className="button-container">
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
          </form>
        </section>
      </>
    );
  },
);

AddTrialSession.displayName = 'AddTrialSession';
