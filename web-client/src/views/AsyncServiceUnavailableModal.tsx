import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

export const AsyncServiceUnavailableModal = connect(
  {},
  function AsyncServiceUnavailableModal() {
    return (
      <ModalDialog
        className="app-maintenance-modal text-center"
        closeLink={false}
        confirmLabel="Yes!"
        showButtons={false}
        title="Test"
      ></ModalDialog>
    );
  },
);

AsyncServiceUnavailableModal.displayName = 'AsyncServiceUnavailableModal';
