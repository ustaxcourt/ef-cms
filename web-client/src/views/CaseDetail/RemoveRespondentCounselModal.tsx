import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const RemoveRespondentCounselModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.removeRespondentCounselFromCaseSequence,
    form: state.form,
  },
  function RemoveRespondentCounselModal({
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
        <div className="margin-bottom-2" id="remove-respondent-modal">
          Are you sure you want to remove {form.name} ({form.barNumber}) from
          this case?
        </div>
      </ModalDialog>
    );
  },
);

RemoveRespondentCounselModal.displayName = 'RemoveRespondentCounselModal';
