import { ModalDialog } from './ModalDialog';
import { TROUBLESHOOTING_INFO } from '@shared/business/entities/EntityConstants';
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
          We were unable to complete service to the IRS. Please email{' '}
          <a href={`mailto:${TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}`}>
            {TROUBLESHOOTING_INFO.APP_SUPPORT_EMAIL}
          </a>{' '}
          with the docket number.
        </div>
      </ModalDialog>
    );
  },
);

ServeCaseToIrsErrorModal.displayName = 'ServeCaseToIrsErrorModal';
