import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props as cerebralProps } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { RunableSequence as RunnableSequence } from 'cerebral';

const props = cerebralProps as unknown as {
  confirmSequence: string;
};

export const StrikeDocketEntryModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences[props.confirmSequence],
  },
  function StrikeDocketEntryModal({
    cancelSequence,
    confirmSequence,
  }: {
    cancelSequence: Function | RunnableSequence;
    confirmSequence: Function | RunnableSequence;
  }) {
    return (
      <ModalDialog
        cancelLabel="No, Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Yes, Strike Entry"
        confirmSequence={confirmSequence}
        message="This action cannot be undone."
        title="Are You Sure You Want to Strike This Docket Entry?"
      ></ModalDialog>
    );
  },
);

StrikeDocketEntryModal.displayName = 'StrikeDocketEntryModal';
