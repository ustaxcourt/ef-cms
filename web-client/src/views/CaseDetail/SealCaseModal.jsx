import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SealCaseModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.sealCaseSequence,
    formattedCaseDetail: state.formattedCaseDetail,
  },
  function SealCaseModal({
    cancelSequence,
    confirmSequence,
    formattedCaseDetail,
  }) {
    return (
      <ModalDialog
        cancelLabel="No, Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Yes, Seal Case"
        confirmSequence={confirmSequence}
        title="Are You Sure You Want to Seal This Case?"
      >
        <div>
          {formattedCaseDetail.docketNumberWithSuffix}{' '}
          {formattedCaseDetail.caseTitle}
        </div>
      </ModalDialog>
    );
  },
);
