import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { props, sequences } from 'cerebral';
import React from 'react';

export const FormCancelModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences[props.onCancelSequence],
    useRunConfirmSequence: props.useRunConfirmSequence,
  },
  function FormCancelModalDialog({
    cancelSequence,
    confirmSequence,
    useRunConfirmSequence,
  }) {
    return (
      <ModalDialog
        cancelLabel="No, Take Me Back"
        cancelSequence={cancelSequence}
        confirmLabel="Yes, Cancel"
        confirmSequence={confirmSequence}
        message="If you cancel, your form selections will be lost."
        title="Are You Sure You Want to Cancel?"
        useRunConfirmSequence={useRunConfirmSequence}
      ></ModalDialog>
    );
  },
);
