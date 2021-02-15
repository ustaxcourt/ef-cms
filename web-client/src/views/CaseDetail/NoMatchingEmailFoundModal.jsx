import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const NoMatchingEmailFoundModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    modal: state.modal,
  },
  function NoMatchingEmailFoundModal({ cancelSequence, modal }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Yes, Continue"
        // confirmSequence={confirmSequence}
        title="No Matching Email"
      >
        <div>
          <p>
            {modal.name}
            <br />
            {modal.email}
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
