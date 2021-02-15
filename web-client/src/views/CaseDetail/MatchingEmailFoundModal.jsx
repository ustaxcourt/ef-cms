import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const MatchingEmailFoundModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    // confirmSequence: sequences.submitMatchingEmailFoundModalSequence,
    modal: state.modal,
  },
  function MatchingEmailFoundModal({
    cancelSequence,
    // confirmSequence,
    modal,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Yes, Continue"
        // confirmSequence={confirmSequence}
        title="Matching Email Found"
      >
        <div>
          <p>
            {modal.name}
            <br />
            {modal.email}
          </p>

          <p>This case will be added to the matching email account.</p>

          <p>Do you want to continue?</p>
        </div>
      </ModalDialog>
    );
  },
);
