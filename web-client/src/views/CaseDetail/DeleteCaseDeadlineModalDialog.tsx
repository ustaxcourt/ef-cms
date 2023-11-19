import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const DeleteCaseDeadlineModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.deleteCaseDeadlineSequence,
    form: state.form,
  },
  function DeleteCaseDeadlineModalDialog({
    cancelSequence,
    confirmSequence,
    form,
  }) {
    return (
      <ModalDialog
        cancelLabel="No, Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Yes, Remove"
        confirmSequence={confirmSequence}
        title="Are You Sure You Want to Delete This Deadline?"
      >
        <label className="margin-right-2" htmlFor="deadline-to-delete">
          {form.deadlineDateFormatted}
        </label>
        <span id="deadline-to-delete">{form.description}</span>
      </ModalDialog>
    );
  },
);

DeleteCaseDeadlineModalDialog.displayName = 'DeleteCaseDeadlineModalDialog';
