import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import React from 'react';

export const CompleteCaseMessageModalDialog = connect(
  {},
  function CompleteCaseMessageModalDialog() {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Complete"
        preventCancelOnBlur={true}
        title="Complete Message"
        onCancelSequence="clearModalFormSequence"
        onConfirmSequence={() => {}}
      ></ConfirmModal>
    );
  },
);
