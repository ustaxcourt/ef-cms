import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';

export const AppTimeoutModal = connect(
  {
    confirmSequence: sequences.confirmStayLoggedInSequence,
    idleLogoutSequence: sequences.gotoIdleLogoutSequence,
    shouldIdleLogout: state.shouldIdleLogout,
  },
  ({ confirmSequence, idleLogoutSequence, shouldIdleLogout }) => {
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
