import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const UnsealCaseModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.unsealCaseSequence,
    formattedCaseDetail: state.formattedCaseDetail,
  },
  function UnsealCaseModal({
    cancelSequence,
    confirmSequence,
    formattedCaseDetail,
  }) {
    return (
      <ModalDialog
        cancelLabel="No, Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Yes, Unseal Case"
        confirmSequence={confirmSequence}
        title="Are You Sure You Want to Unseal This Case?"
      >
        <div>
          {formattedCaseDetail.docketNumberWithSuffix}{' '}
          {formattedCaseDetail.caseTitle}
        </div>
      </ModalDialog>
    );
  },
);
