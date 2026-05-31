import { Button } from '../../ustc-ui/Button/Button';
import { ConfirmTrialSessionLocationChangeModalDialog } from '@web-client/views/ConfirmTrialSessionLocationChangeModalDialog';
import { ConfirmTrialSessionStartDateChangeModalDialog } from '@web-client/views/ConfirmTrialSessionStartDateChangeModalDialog';
import { ErrorNotification } from '../ErrorNotification';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { LocationInformationForm } from './LocationInformationForm';
import { SessionAssignmentsForm } from './SessionAssignmentsForm';
import { SessionInformationForm } from './SessionInformationForm';
import { SessionNotesForm } from './SessionNotesForm';
import { TrialSessionDetailsHeader } from '../TrialSessionDetails/TrialSessionDetailsHeader';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const EditTrialSession = connect(
  {
    closeModalAndNavigateBackSequence:
      sequences.closeModalAndNavigateBackSequence,
    handleEditedTrialSessionSequence:
      sequences.handleEditedTrialSessionSequence,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
    showModal: state.modal.showModal,
    updateTrialSessionSequence: sequences.updateTrialSessionSequence,
    persistModal: state.trialSessionChangeModalState.persist,
    openConfirmTrialSessionLocationChangeModalSequence: sequences.openConfirmTrialSessionLocationChangeModalSequence
  },
  function EditTrialSession({
    closeModalAndNavigateBackSequence,
    handleEditedTrialSessionSequence,
    formattedTrialSessionDetails,
    formCancelToggleCancelSequence,
    showModal,
    updateTrialSessionSequence,
    persistModal,
    openConfirmTrialSessionLocationChangeModalSequence
  }) {
    return (
      <>
        <TrialSessionDetailsHeader
          formattedTrialSessionDetails={formattedTrialSessionDetails}
        />

        <section className="usa-section grid-container DocumentDetail">
          <h1 id="edit-trial-session-header">Edit Trial Session</h1>

          <form
            noValidate
            aria-labelledby="edit-trial-session-header"
            className="usa-form maxw-none"
          >
            {showModal === 'FormCancelModalDialog' && (
              <FormCancelModalDialog
                onCancelSequence={closeModalAndNavigateBackSequence}
              />
            )}
            {showModal === 'ConfirmTrialSessionLocationChangeModalDialog' && (
              <ConfirmTrialSessionLocationChangeModalDialog
                cancelSequence={closeModalAndNavigateBackSequence}
                confirmSequence={updateTrialSessionSequence}
              />
            )}
            {showModal === 'ConfirmTrialSessionStartDateChangeModalDialog' && (
              <ConfirmTrialSessionStartDateChangeModalDialog
                cancelSequence={closeModalAndNavigateBackSequence}
                confirmSequence={persistModal ? openConfirmTrialSessionLocationChangeModalSequence : updateTrialSessionSequence}
              />
            )}
            <ErrorNotification />

            <p className="margin-bottom-2 required-statement margin-top-05">
              All fields required unless otherwise noted
            </p>

            <SessionInformationForm addingTrialSession={false} />
            <LocationInformationForm addingTrialSession={false} />
            <SessionAssignmentsForm addingTrialSession={false} />
            <SessionNotesForm addingTrialSession={false} />

            <div className="button-container">
              <Button
                data-testid="submit-edit-trial-session"
                type="button"
                onClick={() => {
                  handleEditedTrialSessionSequence();
                }}
              >
                Save
              </Button>
              <Button
                link
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

EditTrialSession.displayName = 'EditTrialSession';
