import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { props, sequences } from 'cerebral';
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
