import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { props, sequences } from 'cerebral';
import React from 'react';

export const ConfirmEditSignatureModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences[props.confirmSequence],
  },
  function ConfirmEditModal({ cancelSequence, confirmSequence }) {
    return (
      <ModalDialog
        cancelLabel="No, Take Me Back"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Yes, Continue"
        confirmSequence={confirmSequence}
        message="Continuing will remove the current signature from this document."
        title="Are You Sure You Want to Edit this Signature?"
      ></ModalDialog>
    );
  },
);
