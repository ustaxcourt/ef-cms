import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
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
        <div id="no-matching-email-modal">
          <p>
            {form.contactPrimary.name}
            <br />
            {form.contactPrimary.email}
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
