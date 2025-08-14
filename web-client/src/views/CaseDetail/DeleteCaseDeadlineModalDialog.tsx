import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { ConsolidatedCaseGroupInfo } from '@web-client/views/CaseDetail/CaseDeadline/ConsolidatedCaseGroupInfo';
import React from 'react';
import { STATE_KEYS } from '@shared/business/entities/EntityConstants';

export const DeleteCaseDeadlineModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.deleteCaseDeadlineSequence,
    form: state.form,
    consolidatedCases: state[STATE_KEYS.CONSOLIDATED_CASE_DEADLINES],
  },
  function DeleteCaseDeadlineModalDialog({
    cancelSequence,
    confirmSequence,
    form,
    consolidatedCases,
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

        <ConsolidatedCaseGroupInfo
          option="delete"
          consolidatedCaseDeadlines={consolidatedCases}
        />
      </ModalDialog>
    );
  },
);

DeleteCaseDeadlineModalDialog.displayName = 'DeleteCaseDeadlineModalDialog';
