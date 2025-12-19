import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props as cerebralProps } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { RunableSequence as RunnableSequence } from 'cerebral';

const props = cerebralProps as unknown as {
  confirmSequence: string;
};

export const ConfirmEditModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences[props.confirmSequence],
  },
  function ConfirmEditModal({
    cancelSequence,
    confirmSequence,
  }: {
    cancelSequence: Function | RunnableSequence;
    confirmSequence: Function | RunnableSequence;
  }) {
    return (
      <ModalDialog
        cancelLabel="No, Take Me Back"
        cancelSequence={cancelSequence}
        confirmLabel="Yes, Continue"
        confirmSequence={confirmSequence}
        message="Are you sure you want to edit this document?"
        title="Editing This Document Will Remove Signature"
      ></ModalDialog>
    );
  },
);

ConfirmEditModal.displayName = 'ConfirmEditModal';
