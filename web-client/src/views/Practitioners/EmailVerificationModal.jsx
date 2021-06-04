import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EmailVerificationModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    closeVerifyEmailModalAndNavigateToPractitionerDetailSequence:
      sequences.closeVerifyEmailModalAndNavigateToPractitionerDetailSequence,
    pendingEmail: state.form.pendingEmail,
  },
  function EmailVerificationModal({
    cancelSequence,
    closeVerifyEmailModalAndNavigateToPractitionerDetailSequence,
    pendingEmail,
  }) {
    return (
      <ModalDialog
        cancelSequence={cancelSequence}
        confirmLabel="Ok"
        confirmSequence={() =>
          closeVerifyEmailModalAndNavigateToPractitionerDetailSequence()
        }
        title="Verification Email Sent"
      >
        <div className="margin-bottom-4" id="verify-new-email-modal">
          <p>A verification email has been sent to {pendingEmail}.</p>
          <p>
            User will need to verify the new email before it is active and
            applied to all cases.
          </p>
        </div>
      </ModalDialog>
    );
  },
);
