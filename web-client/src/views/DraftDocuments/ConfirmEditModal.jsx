import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const ConfirmEditModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.navigateToEditOrderSequence,
  },
  function ConfirmEditModal({ cancelSequence, confirmSequence }) {
    return (
      <ModalDialog
        cancelLabel="No, Take Me Back"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Yes, Continue"
        confirmSequence={confirmSequence}
        message="Are you sure you want to edit this document?"
        title="Editing This Document Will Remove Signature"
      ></ModalDialog>
    );
  },
);
