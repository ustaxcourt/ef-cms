import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const UnblockFromTrialModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.unblockCaseFromTrialSequence,
  },
  ({ cancelSequence, confirmSequence }) => {
    return (
      <ModalDialog
        cancelLabel="No, cancel"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Yes, remove block"
        confirmSequence={confirmSequence}
        title="Are You Sure You Want to Remove This Block?"
      >
        <div className="margin-bottom-4">
          This case will be eligible to be set for the next available trial
          session.{' '}
        </div>
      </ModalDialog>
    );
  },
);
