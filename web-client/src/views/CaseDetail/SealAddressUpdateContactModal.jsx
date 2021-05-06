import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const SealAddressUpdateContactModal = connect(
  {
    contactToSeal: state.contactToSeal,
  },
  function SealAddressUpdateContactModal({ contactToSeal }) {
    return (
      <ConfirmModal
        cancelLabel="No, Cancel"
        confirmLabel="Yes, Seal Address"
        preventCancelOnBlur={true}
        title="Are You Sure You Want to Seal This Address?"
        onCancelSequence="clearModalFormSequence"
        onConfirmSequence="submitUpdatePetitionerInformationAndSealAddressSequence"
      >
        {contactToSeal.name}
      </ConfirmModal>
    );
  },
);
