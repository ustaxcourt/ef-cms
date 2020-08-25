import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const SealAddressModal = connect(
  {
    contactToSeal: state.contactToSeal,
  },
  function SealAddressModal({ contactToSeal }) {
    return (
      <ConfirmModal
        cancelLabel="No, Cancel"
        confirmLabel="Yes, Seal Address"
        preventCancelOnBlur={true}
        title="Are You Sure You Want to Seal This Address?"
        onCancelSequence="clearModalFormSequence"
        onConfirmSequence="sealAddressSequence"
      >
        {contactToSeal.name}
      </ConfirmModal>
    );
  },
);
