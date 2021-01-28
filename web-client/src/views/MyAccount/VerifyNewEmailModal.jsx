import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const VerifyNewEmailModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    email: state.form.email,
  },
  function VerifyNewEmailModal({ cancelSequence, email }) {
    return (
      <ModalDialog
        confirmLabel="Ok"
        confirmSequence={cancelSequence}
        title="Verify Your New Email"
      >
        <div className="margin-bottom-4" id="add-to-trial-session-modal">
          <p>A verification email has been sent to {email}.</p>
          <p>
            Use your old email to login until you verify your new email address.
          </p>
        </div>
      </ModalDialog>
    );
  },
);
