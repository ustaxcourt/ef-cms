import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const GenericErrorModal = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
  },
  function GenericErrorModal({ clearModalSequence }) {
    return (
      <ModalDialog
        preventCancelOnBlur
        cancelLink={false}
        closeLink={false}
        confirmLabel="Close"
        confirmSequence={clearModalSequence}
        title={'An error occured'}
      >
        Something went wrong, please try again later.
      </ModalDialog>
    );
  },
);

GenericErrorModal.displayName = 'GenericErrorModal';
