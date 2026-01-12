import React from 'react';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';

export const RemovePetitionerEmailModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.removePetitionerEmailSequence,
  },
  function RemovePetitionerEmailModal({ cancelSequence, confirmSequence }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Remove Email"
        confirmSequence={confirmSequence}
        title="Are You Sure You Want to Remove Petitioner Email?"
      >
        <div className="margin-bottom-2" id="remove-petitioner-modal">
          This will remove the petitioner’s email address and change service
          preference to paper.
        </div>
      </ModalDialog>
    );
  },
);

RemovePetitionerEmailModal.displayName = 'RemovePetitionerEmailModal';
