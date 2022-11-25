import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import React from 'react';

/**
 * UnsealDocketEntryModal
 *
 * @returns {JSX.Element} Returns a modal dialog for unsealing a docket entry.
 */
export function UnsealDocketEntryModal() {
  return (
    <ConfirmModal
      cancelLabel="Cancel"
      confirmLabel="Unseal"
      title="Unseal Document"
      onCancelSequence="dismissModalSequence"
      onConfirmSequence="unsealDocketEntrySequence"
    >
      Are you sure you want to unseal this document?
    </ConfirmModal>
  );
}

UnsealDocketEntryModal.displayName = 'UnsealDocketEntryModal';
