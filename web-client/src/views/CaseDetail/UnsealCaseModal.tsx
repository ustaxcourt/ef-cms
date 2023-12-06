import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
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

UnsealCaseModal.displayName = 'UnsealCaseModal';
