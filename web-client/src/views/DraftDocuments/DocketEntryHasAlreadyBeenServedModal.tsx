import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const DocketEntryHasAlreadyBeenServedModal = connect(
  {
    refreshCaseSequence: sequences.closeModalAndRefetchCase,
  },
  function DocketEntryHasAlreadyBeenServedModal({ refreshCaseSequence }) {
    return (
      <ModalDialog
        cancelSequence={refreshCaseSequence}
        closeLink={false}
        confirmLabel="Close and Refresh"
        confirmSequence={refreshCaseSequence}
        message="This action could not be completed because this document was already served."
        title="Document Already Served"
      ></ModalDialog>
    );
  },
);

DocketEntryHasAlreadyBeenServedModal.displayName =
  'DocketEntryHasAlreadyBeenServedModal';
