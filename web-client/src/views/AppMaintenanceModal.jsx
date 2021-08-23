import { Button } from '../ustc-ui/Button/Button';
import { Icon } from '../ustc-ui/Icon/Icon';
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
    runCancelSequence,
    shouldIdleLogout,
  }) {
    useEffect(() => {
      if (shouldIdleLogout === true) {
        idleLogoutSequence();
      }
    });

    return (
      <ModalDialog
        className="app-maintenance-modal text-center"
        closeLink={false}
        showButtons={false}
      >
        <div className="circle">
          <Icon
            aria-label="wrench"
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
          <Button onClick={confirmSequence}>Log Out</Button>
        </p>
        <p className="text-center margin-top-0">
          <Button
            link
            // link={cancelLink}
            onClick={runCancelSequence}
          >
            Cancel
          </Button>
        </p>
      </ModalDialog>
    );
  },
);
