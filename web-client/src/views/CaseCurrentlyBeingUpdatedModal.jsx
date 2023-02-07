import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const CaseCurrentlyBeingUpdatedModal = connect(
  { reloadPageSequence: sequences.reloadPageSequence },
  function CaseCurrentlyBeingUpdatedModal({ reloadPageSequence }) {
    return (
      <ModalDialog
        preventCancelOnBlur
        cancelLink={false}
        closeLink={false}
        confirmLabel="Close and Refresh"
        confirmSequence={reloadPageSequence}
        title={'Case being updated'}
      >
        This case is being updated, please refresh your view and try again.
      </ModalDialog>
    );
  },
);

CaseCurrentlyBeingUpdatedModal.displayName = 'CaseCurrentlyBeingUpdatedModal';
