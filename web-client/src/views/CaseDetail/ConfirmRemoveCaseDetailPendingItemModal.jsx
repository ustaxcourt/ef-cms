import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const ConfirmRemoveCaseDetailPendingItemModal = connect(
  {
    documentTitle: state.modal.documentTitle,
  },
  ({ documentTitle }) => {
    return (
      <ConfirmModal
        cancelLabel="No, take me back"
        confirmLabel="Yes, continue"
        preventCancelOnBlur={true}
        title={`Remove ${documentTitle} from Pending Report`}
        onCancelSequence="clearModalSequence"
        onConfirmSequence="removeCaseDetailPendingItemSequence"
      >
        <p>Are you sure you want to remove this from the Pending Report?</p>
      </ConfirmModal>
    );
  },
);
