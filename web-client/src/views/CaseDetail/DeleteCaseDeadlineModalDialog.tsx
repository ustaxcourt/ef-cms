import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { ConsolidatgedCaseGroupInfo } from '@web-client/views/CaseDetail/CaseDeadline/ConsolidatgedCaseGroupInfo';
import React from 'react';

export const DeleteCaseDeadlineModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.deleteCaseDeadlineSequence,
    form: state.form,
    caseDetail: state.caseDetail,
  },
  function DeleteCaseDeadlineModalDialog({
    cancelSequence,
    confirmSequence,
    form,
    caseDetail,
  }) {
    const { docketNumber, leadDocketNumber, consolidatedCases } = caseDetail;
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

        <ConsolidatgedCaseGroupInfo
          option="delete"
          docketNumber={docketNumber}
          leadDocketNumber={leadDocketNumber}
          consolidatedCases={consolidatedCases}
        />
      </ModalDialog>
    );
  },
);

DeleteCaseDeadlineModalDialog.displayName = 'DeleteCaseDeadlineModalDialog';
