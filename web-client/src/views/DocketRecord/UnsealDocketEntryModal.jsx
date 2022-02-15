import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const UnsealDocketEntryModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.unsealDocketEntrySequence,
  },
  function UnsealDocketEntryModal({ cancelSequence, confirmSequence }) {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Unseal"
        title="Unseal Document"
        onCancel={cancelSequence}
        onConfirm={confirmSequence}
      >
        Are you sure you want to unseal this document?
      </ConfirmModal>
    );
  },
);
