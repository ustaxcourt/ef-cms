import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const VerifyNewEmailModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    closeVerifyEmailModalAndNavigateToMyAccountSequence:
      sequences.closeVerifyEmailModalAndNavigateToMyAccountSequence,
    email: state.form.email,
    navigateToPathSequence: sequences.navigateToPathSequence,
  },
  function VerifyNewEmailModal({
    cancelSequence,
    closeVerifyEmailModalAndNavigateToMyAccountSequence,
    email,
  }) {
    return (
      <ModalDialog
        cancelSequence={cancelSequence}
        confirmLabel="Ok"
        confirmSequence={() =>
          closeVerifyEmailModalAndNavigateToMyAccountSequence({
            path: '/my-account',
          })
        }
        title="Verify Your New Email"
      >
        <div className="margin-bottom-4" id="verify-new-email-modal">
          <p>A verification email has been sent to {email}.</p>
          <p>
            Use your old email to login until you verify your new email address.
          </p>
        </div>
      </ModalDialog>
    );
  },
);

VerifyNewEmailModal.displayName = 'VerifyNewEmailModal';
