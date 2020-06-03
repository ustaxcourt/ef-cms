import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const DeleteCorrespondenceModal = connect(
  { clearModalSequence: sequences.clearModalSequence },
  function DeleteCorrespondenceModal() {
    return (
      <ConfirmModal
        cancelLabel="No, Take me back"
        confirmLabel="Yes, Delete"
        title={'Are You Sure You Want to Delete This Document?'}
        onCancelSequence="clearModalSequence"
        onConfirmSequence="clearModalSequence"
      >
        <div className="padding-bottom-1">
          Once deleted, it can’t be restored.
        </div>
        <span className="padding-bottom-1">
          <strong>Internal Memo</strong>
        </span>
      </ConfirmModal>
    );
  },
);
