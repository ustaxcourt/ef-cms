import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ServeCaseToIrsDuplicateErrorModal = connect(
  {
    confirmSequence: sequences.closeModalAndReturnToCaseDetailSequence,
  },
  function ServeCaseToIrsDuplicateErrorModal({ confirmSequence }) {
    return (
      <ModalDialog
        confirmLabel="Close and Refresh"
        closeLink={false}
        confirmSequence={confirmSequence}
        title={'Petition has already been served.'}
        dataTestId="serve-case-to-irs-duplicate-error-modal"
      >
        <div className="file-upload-error">
          Click the button to refresh the data and navigate to your previous
          page or workflow.
        </div>
      </ModalDialog>
    );
  },
);

ServeCaseToIrsDuplicateErrorModal.displayName =
  'ServeCaseToIrsDuplicateErrorModal';
