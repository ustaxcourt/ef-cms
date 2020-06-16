import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import React from 'react';

export const ForwardCaseMessageModalDialog = connect(
  {},
  function ForwardCaseMessageModalDialog() {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Complete"
        preventCancelOnBlur={true}
        title="Forward Message"
        onCancelSequence="clearModalFormSequence"
        onConfirmSequence={() => {}}
      ></ConfirmModal>
    );
  },
);
