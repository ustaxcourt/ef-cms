import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const RemovePetitionerCounselModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.removePetitionerCounselFromCaseSequence,
    form: state.form,
  },
  function RemovePetitionerCounselModal({
    cancelSequence,
    confirmSequence,
    form,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Yes, Remove"
        confirmSequence={confirmSequence}
        title="Remove Counsel"
      >
        <div className="margin-bottom-2" id="remove-petitioner-modal">
          Are you sure you want to remove {form.name} ({form.barNumber}) from
          this case?
        </div>
      </ModalDialog>
    );
  },
);
