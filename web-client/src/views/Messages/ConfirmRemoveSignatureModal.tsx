import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props as cerebralProps } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { RunableSequence as RunnableSequence } from 'cerebral';

const props = cerebralProps as unknown as {
  confirmSequence: string;
};

type ConfirmRemoveSignatureModalProps = {
  confirmSequence: string;
}


export const ConfirmRemoveSignatureModal: React.FC<ConfirmRemoveSignatureModalProps> = connect(
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
        confirmLabel="Yes, Remove Signature"
        confirmSequence={confirmSequence}
        message="This cannot be undone. You will need to reapply a signature to this document."
        title="Are You Sure You Want to Remove this Signature?"
      ></ModalDialog>
    );
  },
);

ConfirmRemoveSignatureModal.displayName = 'ConfirmRemoveSignatureModal';
