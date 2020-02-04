import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const ServeToIrsModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.submitPetitionToIRSHoldingQueueSequence,
  },
  ({ cancelSequence, confirmSequence }) => {
    return (
      <ModalDialog
        cancelLabel="No, Take Me Back"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Yes, Serve"
        confirmSequence={confirmSequence}
        message="This Petition will be added to the batch to serve to the IRS at 3pm."
        title="Are you sure you want to serve this Petition to the IRS?"
      ></ModalDialog>
    );
  },
);
