import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

type WorkItemAlreadyCompletedModalProps = {
  confirmSequence: Function;
};

export const WorkItemAlreadyCompletedModal: React.FC<WorkItemAlreadyCompletedModalProps> =
  connect({}, function WorkItemAlreadyCompletedModal({ confirmSequence }) {
    return (
      <ModalDialog
        cancelLink={false}
        closeLink={false}
        confirmLabel="Close and Refresh"
        confirmSequence={confirmSequence}
        dataTestId="work-item-already-completed-modal"
        title={'Document Has Already Been Handled'}
      >
        Click the button to refresh the data and navigate to your previous page
        or workflow.
      </ModalDialog>
    );
  });

WorkItemAlreadyCompletedModal.displayName = 'WorkItemAlreadyCompletedModal';
