import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AccountUnverifiedModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
  },
  function AccountUnverifiedModal({ cancelSequence }) {
    return (
      <ModalDialog
        cancelSequence={cancelSequence}
        confirmLabel="OK"
        confirmSequence={cancelSequence}
        title="Account is Unverified"
      >
        <div>
          <p>
            This account is unverified. Please contact the user and ask them to
            verify their email address.
          </p>
        </div>
      </ModalDialog>
    );
  },
);

AccountUnverifiedModal.displayName = 'AccountUnverifiedModal';
