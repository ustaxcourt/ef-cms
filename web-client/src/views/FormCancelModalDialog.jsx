import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { props, sequences } from 'cerebral';
import React from 'react';

export const FormCancelModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences[props.onCancelSequence],
  },
  ({ cancelSequence, confirmSequence }) => {
    return (
      <ModalDialog
        cancelLabel="No, take me back"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Yes, cancel"
        confirmSequence={confirmSequence}
        message="If you cancel, your form selections will be lost."
        title="Are you sure you want to cancel?"
      ></ModalDialog>
    );
  },
);
