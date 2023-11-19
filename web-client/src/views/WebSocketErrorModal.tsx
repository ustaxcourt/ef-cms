import { ConfirmModal } from '../ustc-ui/Modal/ConfirmModal';
import { connect } from '@web-client/presenter/shared.cerebral';
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
      title="An Unexpected Error Occurred"
      onCancelSequence="clearModalSequence"
      onConfirmSequence="clearModalSequence"
    >
      <p>Try again, or contact dawson.support@ustaxcourt.gov for assistance.</p>
    </ConfirmModal>
  );
});

WebSocketErrorModal.displayName = 'WebSocketErrorModal';
