import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const SealAddressModal = connect(
  {
    clearModalFormSequence: sequences.clearModalFormSequence,
    contactToSeal: state.contactToSeal,
    sealAddressSequence: sequences.sealAddressSequence,
  },
  function SealAddressModal({
    clearModalFormSequence,
    contactToSeal,
    sealAddressSequence,
  }) {
    return (
      <ConfirmModal
        cancelLabel="No, Cancel"
        confirmLabel="Yes, Seal Address"
        preventCancelOnBlur={true}
        title="Are You Sure You Want to Seal This Address?"
        onCancelSequence={clearModalFormSequence}
        onConfirmSequence={sealAddressSequence}
      >
        {contactToSeal.name}
      </ConfirmModal>
    );
  },
);

SealAddressModal.displayName = 'SealAddressModal';
