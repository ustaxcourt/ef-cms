import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@cerebral/react';
import React from 'react';

export const WorkItemAlreadyCompletedModal = connect(
  {},
  function WorkItemAlreadyCompletedModal() {
    return (
      <ConfirmModal
        noCancel
        noCloseBtn
        confirmLabel="Take Me Back"
        title={'ERROR!'}
        onConfirmSequence="navigateToCaseDetailSequence"
      >
        The docket entry QC has already been completed.
      </ConfirmModal>
    );
  },
);
