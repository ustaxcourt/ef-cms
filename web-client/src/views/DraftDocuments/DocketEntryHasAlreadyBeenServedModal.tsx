import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import React from 'react';

export const DocketEntryHasAlreadyBeenServedModal = connect(
  {
    // cancelSequence: sequences.bleh,
    // confirmSequence: sequences.blah,
  },
  function DocketEntryHasAlreadyBeenServedModal({
    cancelSequence,
    confirmSequence,
  }) {
    return (
      <ModalDialog
        cancelLabel="Discard Draft"
        cancelSequence={cancelSequence}
        confirmLabel="Save as New Draft"
        confirmSequence={confirmSequence}
        message="This document was served. Your changes were not saved."
        title="Document Already Served"
      ></ModalDialog>
    );
  },
);

DocketEntryHasAlreadyBeenServedModal.displayName =
  'DocketEntryHasAlreadyBeenServedModal';
