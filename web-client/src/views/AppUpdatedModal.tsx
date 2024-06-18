import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AppUpdatedModal = connect(
  {
    confirmSequence: sequences.redirectToDashboardSequence,
  },
  function AppUpdatedModal({ confirmSequence }) {
    return (
      <ModalDialog
        preventCancelOnBlur
        className="app-updated-modal"
        closeLink={false}
        confirmLabel="Close and Refresh"
        confirmSequence={confirmSequence}
        title="DAWSON Update"
      >
        <div>
          DAWSON has been updated. Click the button to refresh the app and
          navigate to your home page.
        </div>
      </ModalDialog>
    );
  },
);

AppUpdatedModal.displayName = 'AppUpdatedModal';
