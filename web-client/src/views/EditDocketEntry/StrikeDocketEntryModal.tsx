import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';
// TODO (#8546): If Order dispossessing a motion is stricken, we should revert related motion dispositions
export const StrikeDocketEntryModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences[props.confirmSequence],
  },
  function StrikeDocketEntryModal({ cancelSequence, confirmSequence }) {
    return (
      <ModalDialog
        cancelLabel="No, Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Yes, Strike Entry"
        confirmSequence={confirmSequence}
        message="This action cannot be undone."
        title="Are You Sure You Want to Strike This Docket Entry?"
      ></ModalDialog>
    );
  },
);

StrikeDocketEntryModal.displayName = 'StrikeDocketEntryModal';
