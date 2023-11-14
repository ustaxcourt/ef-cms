import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AppTimeoutModal = connect(
  {
    confirmSequence: sequences.broadcastStayLoggedInSequence,
  },
  function AppTimeoutModal({ confirmSequence }) {
    return (
      <ModalDialog
        preventCancelOnBlur
        className="app-timeout-modal"
        confirmLabel="Yes!"
        confirmSequence={confirmSequence}
      >
        <div>Are you still there?</div>
      </ModalDialog>
    );
  },
);

AppTimeoutModal.displayName = 'AppTimeoutModal';
