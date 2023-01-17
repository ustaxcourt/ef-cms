import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import React from 'react';

export const ItemizedPenaltiesModal = connect(
  {},
  function ItemizedPenaltiesModal() {
    return (
      <ModalDialog className="text-center" showButtons={false}>
        <div>Other words</div>
      </ModalDialog>
    );
  },
);

ItemizedPenaltiesModal.displayName = 'ItemizedPenaltiesModal';
