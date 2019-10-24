import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const ConfirmEditModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.navigateToEditOrderSequence,
  },
  ({ cancelSequence, confirmSequence }) => {
    return (
      <ModalDialog
        cancelLabel="No, take me back"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Yes, continue"
        confirmSequence={confirmSequence}
        message="Are you sure you want to edit this document?"
        title="Editing This Document Will Remove Signature"
      ></ModalDialog>
    );
  },
);
