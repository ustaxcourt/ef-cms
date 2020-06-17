import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import React from 'react';

export const ReplyToCaseMessageModalDialog = connect(
  {},
  function ReplyToCaseMessageModalDialog() {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Send"
        preventCancelOnBlur={true}
        title="Reply to Message"
        onCancelSequence="clearModalFormSequence"
        onConfirmSequence={() => {}}
      ></ConfirmModal>
    );
  },
);
