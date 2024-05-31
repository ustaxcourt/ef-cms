import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AppUpdatedModal = connect(
  {
    confirmSequence: sequences.redirectToDashboardSequence,
  },
  function AppTimeoutModal({ confirmSequence }) {
    return (
      <ModalDialog
        preventCancelOnBlur
        className="app-updated-modal"
        closeLink={false}
        confirmLabel="Return to Dashboard"
        confirmSequence={confirmSequence}
      >
        <div>The app has been updated.</div>
      </ModalDialog>
    );
  },
);

AppUpdatedModal.displayName = 'AppUpdatedModal';
