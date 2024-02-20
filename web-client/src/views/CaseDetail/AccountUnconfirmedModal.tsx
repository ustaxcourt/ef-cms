import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AccountUnconfirmedModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    form: state.form,
  },
  function MatchingEmailFoundModal({ cancelSequence, form }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="OK"
        confirmSequence={cancelSequence}
        title="Account is Unverified"
      >
        <div>
          <p>
            {form.contact.updatedEmail} has started the account creation
            process, but their account has not been verified. Please contact the
            user and ask them to verify their account.
          </p>
        </div>
      </ModalDialog>
    );
  },
);

AccountUnconfirmedModal.displayName = 'AccountUnconfirmedModal';
