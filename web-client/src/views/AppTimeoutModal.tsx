import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useEffect } from 'react';

export const AppTimeoutModal = connect(
  {
    confirmSequence: sequences.broadcastStayLoggedInSequence,
    idleLogoutSequence: sequences.gotoIdleLogoutSequence,
    shouldIdleLogout: state.shouldIdleLogout,
  },
  function AppTimeoutModal({
    confirmSequence,
    idleLogoutSequence,
    shouldIdleLogout,
  }) {
    useEffect(() => {
      if (shouldIdleLogout === true) {
        idleLogoutSequence();
      }
    });

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
