import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AppTimeoutModal = connect(
  {
    confirmSequence: sequences.broadcastStayLoggedInSequence,
  },
  function AppTimeoutModal({ confirmSequence }) {
    return (
      <ModalDialog
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
