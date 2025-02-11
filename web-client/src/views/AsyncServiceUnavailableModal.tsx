import { sequences } from '@web-client/presenter/app.cerebral';
import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

export const AsyncServiceUnavailableModal = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
  },
  function AsyncServiceUnavailableModal({ clearModalSequence }) {
    return (
      <ModalDialog
        closeLink
        showButtons={true}
        confirmLabel="Close"
        title="Unable to Complete Action"
        message="This Docket Entry, Trial Session or Case is currently being modified. Please try again later. This can take up to 15 minutes."
        cancelSequence={clearModalSequence}
        confirmSequence={clearModalSequence}
      />
    );
  },
);

AsyncServiceUnavailableModal.displayName = 'AsyncServiceUnavailableModal';
