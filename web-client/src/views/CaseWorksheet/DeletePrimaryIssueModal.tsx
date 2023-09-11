import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const DeletePrimaryIssueModal = connect(
  {
    modal: state.modal,
    validationErrors: state.validationErrors,
  },
  function DeletePrimaryIssueModal() {
    return (
      <ConfirmModal
        noCloseBtn
        cancelLabel="No, Cancel"
        confirmLabel="Yes, Delete"
        preventCancelOnBlur={true}
        title="Are You Sure You Want to Delete This Primary Issue?"
        onCancelSequence="clearModalSequence"
        onConfirmSequence="deletePrimaryIssueSequence"
      >
        <p>This action cannot be undone.</p>
      </ConfirmModal>
    );
  },
);

DeletePrimaryIssueModal.displayName = 'DeletePrimaryIssueModal';
