import { ModalDialog } from '../ModalDialog';
import { WarningNotificationComponent } from '../WarningNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const RemovePetitionerCounselModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.removePetitionerFromCaseSequence,
    constants: state.constants,
    form: state.form,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateUpdateCaseModalSequence: sequences.validateUpdateCaseModalSequence,
    validationErrors: state.validationErrors,
  },
  function RemovePetitionerModal({
    cancelSequence,
    confirmSequence,
    form,
    modal,
    updateModalValueSequence,
    validateUpdateCaseModalSequence,
    validationErrors,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Yes, Remove"
        confirmSequence={confirmSequence}
        title="Remove Counsel"
      >
        <div className="margin-bottom-2" id="remove-petitioner-modal">
          <WarningNotificationComponent
            alertWarning={{
              title: `Are you sure you want to remove ${form.name} from this case?`,
            }}
            dismissable={false}
            scrollToTop={false}
          />
        </div>
      </ModalDialog>
    );
  },
);
