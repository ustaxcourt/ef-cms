import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

export const WorkItemAlreadyCompletedModal = connect(
  {},
  function WorkItemAlreadyCompletedModal({ confirmSequence }) {
    return (
      <ModalDialog
        preventCancelOnBlur
        cancelLink={false}
        closeLink={false}
        confirmLabel="Close and Refresh"
        confirmSequence={confirmSequence}
        title={'Document Has Already Been Handled'}
      >
        Click the button to refresh the data and navigate to your previous page
        or workflow.
      </ModalDialog>
    );
  },
);

WorkItemAlreadyCompletedModal.displayName = 'WorkItemAlreadyCompletedModal';
