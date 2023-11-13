import { Button } from '../ustc-ui/Button/Button';
import { Icon } from '../ustc-ui/Icon/Icon';
import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AppMaintenanceModal = connect(
  {
    cancelSequence: sequences.closeModalAndNavigateToMaintenanceSequence,
    signOutSequence: sequences.signOutSequence,
  },
  function AppMaintenanceModal({ cancelSequence, signOutSequence }) {
    return (
      <ModalDialog
        className="app-maintenance-modal text-center"
        closeLink={false}
        showButtons={false}
      >
        <div className="maintenance-circle">
          <Icon
            className="wrench-icon text-center"
            icon={['fas', 'wrench']}
            size="4x"
          />
        </div>
        <h2 className="margin-top-2">DAWSON is undergoing maintenance.</h2>
        <p className="margin-top-2">
          Your work may not be saved. Check back later for updates.
        </p>
        <p className="margin-top-5">
          <Button id="maintenance-logout-btn" onClick={() => signOutSequence()}>
            Log Out
          </Button>
        </p>
        <p className="text-center margin-top-0">
          <Button
            link
            id="maintenance-cancel-btn"
            onClick={() => cancelSequence({ path: '/maintenance' })}
          >
            Cancel
          </Button>
        </p>
      </ModalDialog>
    );
  },
);

AppMaintenanceModal.displayName = 'AppMaintenanceModal';
