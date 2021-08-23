import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React, { useEffect } from 'react';

export const AppMaintenanceModal = connect(
  {
    confirmSequence: sequences.broadcastStayLoggedInSequence,
    idleLogoutSequence: sequences.gotoIdleLogoutSequence,
    shouldIdleLogout: state.shouldIdleLogout,
  },
  function AppMaintenanceModal({
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
        cancelLabel="Cancel"
        cancelLink="www.google.com"
        className="app-maintenance-modal"
        closeLink={false}
        confirmLabel="Log Out"
        confirmSequence={confirmSequence}
      >
        <h2>DAWSON is undergoing maintenance.</h2>
        <p>Your work may not be saved. Check back later for updates.</p>
      </ModalDialog>
    );
  },
);
