import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const UnsealDocketEntryModal = connect(
  {
    dismissModalSequence: sequences.dismissModalSequence,
    unsealDocketEntrySequence: sequences.unsealDocketEntrySequence,
  },
  ({ dismissModalSequence, unsealDocketEntrySequence }) => {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Unseal"
        title="Unseal Document"
        onCancelSequence={dismissModalSequence}
        onConfirmSequence={unsealDocketEntrySequence}
      >
        Are you sure you want to unseal this document?
      </ConfirmModal>
    );
  },
);

UnsealDocketEntryModal.displayName = 'UnsealDocketEntryModal';
