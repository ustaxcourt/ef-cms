import { ModalDialog } from './ModalDialog';
import { WarningNotificationComponent } from './WarningNotification';
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
        className="app-maintenance-modal"
        confirmLabel="Log Out"
        confirmSequence={confirmSequence}
      >
        <WarningNotificationComponent />
      </ModalDialog>
    );
  },
);
