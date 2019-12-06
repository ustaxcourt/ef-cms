import { Hint } from '../ustc-ui/Hint/Hint';
import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const ConfirmInitiateServiceModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.serveCourtIssuedDocumentSequence,
  },
  ({
    cancelSequence,
    confirmSequence,
    documentTitle,
    paperServiceParties = [],
  }) => {
    const hasPaper = paperServiceParties.length > 0;
    return (
      <ModalDialog
        cancelLabel="No, take me back"
        cancelSequence={cancelSequence}
        className="confirm-initiate-service-modal"
        confirmLabel={hasPaper ? 'Yes, Serve and Print' : 'Yes, serve'}
        confirmSequence={confirmSequence}
        title="Are you ready to initiate service?"
      >
        <p className="margin-bottom-1">
          The following document will be served on all parties:
        </p>
        <p className="margin-top-0 margin-bottom-5">
          <strong>{documentTitle}</strong>
        </p>
        {hasPaper && (
          <Hint exclamation fullWidth className="width-100-percent">
            <p className="margin-top-0">
              This case has parties receiving paper service:
            </p>
            {paperServiceParties.map(party => (
              <>
                {party}
                <br />
              </>
            ))}
          </Hint>
        )}
      </ModalDialog>
    );
  },
);
