import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const EmailVerificationModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    closeVerifyEmailModalAndNavigateToPractitionerDetailSequence:
      sequences.closeVerifyEmailModalAndNavigateToPractitionerDetailSequence,
    updatedEmail: state.form.updatedEmail,
  },
  function EmailVerificationModal({
    cancelSequence,
    closeVerifyEmailModalAndNavigateToPractitionerDetailSequence,
    updatedEmail,
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
          <p>A verification email has been sent to {updatedEmail}.</p>
          <p>
            User will need to verify the new email before it is active and
            applied to all cases.
          </p>
        </div>
      </ModalDialog>
    );
  },
);

EmailVerificationModal.displayName = 'EmailVerificationModal';
