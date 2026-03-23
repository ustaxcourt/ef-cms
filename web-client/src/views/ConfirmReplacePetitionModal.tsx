import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props as cerebralProps } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';
import type { FunctionComponent } from 'react';
import { RunableSequence as RunnableSequence } from 'cerebral';

type ConfirmReplacePetitionModalProps = {
  confirmSequence: string;
};

const props = cerebralProps as unknown as ConfirmReplacePetitionModalProps;

const confirmReplacePetitionModalDeps = {
  cancelSequence: sequences.dismissModalSequence,
  confirmSequence: sequences[props.confirmSequence],
};

const ConfirmReplacePetitionModalComponent = connect<
  ConfirmReplacePetitionModalProps,
  typeof confirmReplacePetitionModalDeps
>(
  confirmReplacePetitionModalDeps,
  function ConfirmReplacePetitionModal({
    cancelSequence,
    confirmSequence,
  }: {
    cancelSequence: Function | RunnableSequence;
    confirmSequence: Function | RunnableSequence;
  }) {
    return (
      <ModalDialog
        cancelLabel="No, Keep Current PDF"
        cancelSequence={cancelSequence}
        className="confirm-replace-petition-modal"
        confirmLabel="Yes, Continue"
        confirmSequence={confirmSequence}
        message="You must scan or upload another Petition PDF, or the original PDF will remain on the case."
        title="Are You Sure you Want to Replace this Petition PDF?"
      ></ModalDialog>
    );
  },
);

export const ConfirmReplacePetitionModal =
  ConfirmReplacePetitionModalComponent as FunctionComponent<ConfirmReplacePetitionModalProps>;

ConfirmReplacePetitionModal.displayName = 'ConfirmReplacePetitionModal';
