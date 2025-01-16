import { ModalDialog } from './ModalDialog';
import React from 'react';

export const AppTimeoutModal = ({ onConfirm }: { onConfirm: () => {} }) => {
  return (
    <ModalDialog
      className="app-timeout-modal"
      confirmLabel="Yes!"
      confirmSequence={onConfirm}
    >
      <div data-testid="are-you-still-there-modal">Are you still there?</div>
    </ModalDialog>
  );
};

AppTimeoutModal.displayName = 'AppTimeoutModal';
