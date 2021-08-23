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
        confirmLabel="Log Out"
        confirmSequence={confirmSequence}
        id="app-maintenance-modal"
      >
        <h2>DAWSON is undergoing maintenance.</h2>
        <p>Your work may not be saved. Check back later for updates.</p>
        {/* steal styling from warning notification instead of using it */}
        <WarningNotificationComponent
          alertWarning={{
            message: 'messaaage',
            title: 'titlekjwlskjdfs',
          }}
          dismissable={false}
        />
      </ModalDialog>
    );
  },
);
