import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const NoMatchingEmailFoundModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence:
      sequences.submitUpdatePetitionerInformationFromModalSequence,
    form: state.form,
  },
  function NoMatchingEmailFoundModal({
    cancelSequence,
    confirmSequence,
    form,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Yes, Continue"
        confirmSequence={confirmSequence}
        title="No Matching Email"
      >
        <div data-testid="no-matching-email-modal" id="no-matching-email-modal">
          <p>
            {form.contact.name}
            <br />
            {form.contact.updatedEmail}
          </p>

          <p>
            A new account will be created for this email, and this case will be
            added to the email account.
          </p>

          <p>Do you want to continue?</p>
        </div>
      </ModalDialog>
    );
  },
);

NoMatchingEmailFoundModal.displayName = 'NoMatchingEmailFoundModal';
