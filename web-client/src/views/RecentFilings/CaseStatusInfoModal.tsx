import { CASE_STATUS_TYPES } from '@shared/business/entities/EntityConstants';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import { connect } from '@web-client/presenter/shared.cerebral';

import { ModalDialog } from '@web-client/views/ModalDialog';
import React from 'react';

export const CaseStatusInfoModal = connect(
  { confirmSequence: sequences.clearModalSequence, status: state.modal.title },
  ({ confirmSequence, status }: { confirmSequence: any; status: string }) => {
    const CaseStatusInfoStrings = {
      [CASE_STATUS_TYPES.assignedCase]: 'Case is assigned to a judge',
      [CASE_STATUS_TYPES.assignedMotion]: 'Motion is assigned to a judge.',
      [CASE_STATUS_TYPES.cav]: 'Awaiting resolution.',
      [CASE_STATUS_TYPES.generalDocket]:
        'Case is awaiting calendaring or assignment.',
      [CASE_STATUS_TYPES.generalDocketReadyForTrial]:
        'Case is awaiting calendaring or assignment.',
      [CASE_STATUS_TYPES.new]: 'Petition has been filed with the court.',
      [CASE_STATUS_TYPES.jurisdictionRetained]: 'Case is assigned to a judge.',
      [CASE_STATUS_TYPES.onAppeal]: 'Case is on appeal.',
      [CASE_STATUS_TYPES.rule155]: 'Case is awaiting computations.',
      [CASE_STATUS_TYPES.submitted]: 'Awaiting resolution.',
      [CASE_STATUS_TYPES.submittedRule122]: 'Awaiting resolution.',
      [CASE_STATUS_TYPES.calendared]: 'Case is scheduled for trial.',
    };
    return (
      <ModalDialog
        title={status}
        confirmLabel="Close"
        confirmSequence={confirmSequence}
        cancelSequence={confirmSequence}
      >
        <div data-testid="caseStatusInfoModal">
          {CaseStatusInfoStrings[status]}
        </div>
      </ModalDialog>
    );
  },
);

CaseStatusInfoModal.displayName = 'CaseStatusInfoModal';
