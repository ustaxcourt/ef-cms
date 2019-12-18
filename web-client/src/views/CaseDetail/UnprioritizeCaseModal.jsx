import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const UnprioritizeCaseModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.unprioritizeCaseSequence,
  },
  ({ cancelSequence, confirmSequence }) => {
    return (
      <ModalDialog
        cancelLabel="No, cancel"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Yes, remove high priority"
        confirmSequence={confirmSequence}
        title="Are You Sure You Want to Remove the High Priority on This Case?"
      >
        <div className="margin-bottom-4" id="unprioritize-modal">
          <div className="margin-bottom-2">
            This case will be set for trial according to standard priority.{' '}
          </div>
        </div>
      </ModalDialog>
    );
  },
);
