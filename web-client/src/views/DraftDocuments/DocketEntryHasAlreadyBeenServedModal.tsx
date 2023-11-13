import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
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
