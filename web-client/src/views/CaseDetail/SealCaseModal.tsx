import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
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

SealCaseModal.displayName = 'SealCaseModal';
