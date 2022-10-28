import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import React from 'react';

export const WorkItemAlreadyCompletedModal = connect(
  {},
  function WorkItemAlreadyCompletedModal({ confirmSequence }) {
    return (
      <ModalDialog
        preventCancelOnBlur
        cancelLink={false}
        closeLink={false}
        confirmLabel="Take Me Back"
        confirmSequence={confirmSequence}
        title={'ERROR!'}
      >
        The docket entry QC has already been completed.
      </ModalDialog>
    );
  },
);
