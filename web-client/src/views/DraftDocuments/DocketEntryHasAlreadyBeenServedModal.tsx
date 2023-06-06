import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const DocketEntryHasAlreadyBeenServedModal = connect(
  {
    refreshCaseSequence: sequences.discardDraftDocketEntrySequence,
  },
  function DocketEntryHasAlreadyBeenServedModal({ refreshCaseSequence }) {
    return (
      <ModalDialog
        closeLink={false}
        confirmLabel="Ok"
        confirmSequence={refreshCaseSequence}
        message="This document was served. Your changes were not saved."
        title="Document Already Served"
      ></ModalDialog>
    );
  },
);

DocketEntryHasAlreadyBeenServedModal.displayName =
  'DocketEntryHasAlreadyBeenServedModal';
