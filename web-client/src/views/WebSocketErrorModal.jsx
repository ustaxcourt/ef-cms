import { ConfirmModal } from '../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import React from 'react';

export const WebSocketErrorModal = connect({}, function WebSocketErrorModal() {
  return (
    <ConfirmModal
      cancelLabel="Cancel"
      confirmLabel="Ok"
      hasErrorState={true}
      headerIcon="info-circle"
      headerIconClassName="text-secondary-dark"
      noCancel={true}
      preventCancelOnBlur={true}
      title="An Unexpected Error Occured"
      onCancelSequence="clearModalSequence"
      onConfirmSequence="clearModalSequence"
    >
      <p>Please try again. If the problem persists, please contact support.</p>
    </ConfirmModal>
  );
});
