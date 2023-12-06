import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
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

FormCancelModalDialog.displayName = 'FormCancelModalDialog';
