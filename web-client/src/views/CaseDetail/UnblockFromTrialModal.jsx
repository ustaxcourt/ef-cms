import { Hint } from '../../ustc-ui/Hint/Hint';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const UnblockFromTrialModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    caseDetail: state.caseDetail,
    confirmSequence: sequences.unblockCaseFromTrialSequence,
  },
  function UnblockFromTrialModal({
    cancelSequence,
    caseDetail,
    confirmSequence,
  }) {
    return (
      <ModalDialog
        cancelLabel="No, Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Yes, Remove Block"
        confirmSequence={confirmSequence}
        title="Are You Sure You Want to Remove This Block?"
      >
        <div className="text-semibold margin-bottom-2">
          {caseDetail.blockedReason}
        </div>
        {!caseDetail.automaticBlocked && (
          <div>
            This case will be eligible to be set for the next available trial
            session.
          </div>
        )}
        {caseDetail.automaticBlocked && (
          <Hint exclamation className="margin-bottom-0">
            This case has pending items or due dates automatically blocking it
            from trial. You must remove the pending item or due date to make
            this case eligible for trial.
          </Hint>
        )}
      </ModalDialog>
    );
  },
);
