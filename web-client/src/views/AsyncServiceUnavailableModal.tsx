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
        showButtons={false}
        title="Test"
        message="Message"
        cancelSequence={clearModalSequence}
        confirmSequence={clearModalSequence}
      />
    );
  },
);

AsyncServiceUnavailableModal.displayName = 'AsyncServiceUnavailableModal';
