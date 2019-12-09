import { Hint } from '../ustc-ui/Hint/Hint';
import { ModalDialog } from './ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const ConfirmInitiateServiceModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmInitiateServiceModalHelper: state.confirmInitiateServiceModalHelper,
    confirmSequence: sequences.serveCourtIssuedDocumentSequence,
  },
  ({
    cancelSequence,
    confirmInitiateServiceModalHelper,
    confirmSequence,
    documentTitle,
  }) => {
    return (
      <ModalDialog
        cancelLabel="No, take me back"
        cancelSequence={cancelSequence}
        className="confirm-initiate-service-modal"
        confirmLabel={confirmInitiateServiceModalHelper.confirmLabel}
        confirmSequence={confirmSequence}
        title="Are you ready to initiate service?"
      >
        <p className="margin-bottom-1">
          The following document will be served on all parties:
        </p>
        <p className="margin-top-0 margin-bottom-5">
          <strong>{documentTitle}</strong>
        </p>
        {confirmInitiateServiceModalHelper.showPaperAlert && (
          <Hint exclamation fullWidth className="block">
            <div className="margin-bottom-1">
              This case has parties receiving paper service:
            </div>
            {confirmInitiateServiceModalHelper.contactsNeedingPaperService.map(
              contact => (
                <div className="margin-bottom-1" key={contact.name}>
                  {contact.name}
                </div>
              ),
            )}
          </Hint>
        )}
      </ModalDialog>
    );
  },
);
