import { CASE_STATUS_EXPLAINERS } from '@shared/business/entities/EntityConstants';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import { connect } from '@web-client/presenter/shared.cerebral';

import { ModalDialog } from '@web-client/views/ModalDialog';
import React from 'react';

export const CaseStatusInfoModal = connect(
  { confirmSequence: sequences.clearModalSequence, status: state.modal.title },
  ({ confirmSequence, status }: { confirmSequence: any; status: string }) => {
    return (
      <ModalDialog
        title={status}
        confirmLabel="Close"
        confirmSequence={confirmSequence}
        cancelSequence={confirmSequence}
      >
        <div data-testid="caseStatusInfoModal">
          {CASE_STATUS_EXPLAINERS[status]}
        </div>
      </ModalDialog>
    );
  },
);

CaseStatusInfoModal.displayName = 'CaseStatusInfoModal';
