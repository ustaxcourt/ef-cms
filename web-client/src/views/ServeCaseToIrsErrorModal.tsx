import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ServeCaseToIrsErrorModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
  },
  function ServeCaseToIrsErrorModal({ cancelSequence }) {
    return (
      <ModalDialog
        cancelSequence={cancelSequence}
        confirmLabel="Close"
        confirmSequence={cancelSequence}
        title={'Unable to Serve to IRS'}
      >
        <div className="file-upload-error">
          We were unable to complete service to the IRS. Please email
          <a href="mailto:dawson.support@ustaxcourt.gov">
            dawson.support@ustaxcourt.gov
          </a>
          with the docket number.
        </div>
      </ModalDialog>
    );
  },
);

ServeCaseToIrsErrorModal.displayName = 'ServeCaseToIrsErrorModal';
