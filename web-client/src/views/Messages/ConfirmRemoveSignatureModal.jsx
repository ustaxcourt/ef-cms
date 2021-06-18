import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { props, sequences } from 'cerebral';
import React from 'react';

export const ConfirmRemoveSignatureModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences[props.confirmSequence],
  },
  function ConfirmEditModal({ cancelSequence, confirmSequence }) {
    return (
      <ModalDialog
        cancelLabel="No, Take Me Back"
        cancelSequence={cancelSequence}
        confirmLabel="Yes, Remove Signature"
        confirmSequence={confirmSequence}
        message="This cannot be undone. You will need to reapply a signature to this document."
        title="Are You Sure You Want to Remove this Signature?"
      ></ModalDialog>
    );
  },
);
