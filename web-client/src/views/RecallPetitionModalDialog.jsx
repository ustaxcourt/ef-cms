import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const RecallPetitionModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.submitRecallPetitionFromIRSHoldingQueueSequence,
  },
  ({ cancelSequence, confirmSequence }) => {
    return (
      <ModalDialog
        cancelLabel="No, Keep in Batch"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Yes, Recall"
        confirmSequence={confirmSequence}
        message="Recalling this Petition will remove it from the IRS service batch and return it to your work queue."
        title="Are you sure you want to recall this Petition?"
      ></ModalDialog>
    );
  },
);
