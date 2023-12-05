import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const StrikeDocketEntryModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences[props.confirmSequence],
  },
  function StrikeDocketEntryModal({ cancelSequence, confirmSequence }) {
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
