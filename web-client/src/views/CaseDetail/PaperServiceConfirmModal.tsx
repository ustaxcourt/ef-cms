import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PaperServiceConfirmModal = connect(
  {
    confirmInitiateServiceModalHelper: state.confirmInitiateServiceModalHelper,
    documentTitle: state.form.documentTitle,
  },
  function PaperServiceConfirmModal({
    confirmInitiateServiceModalHelper,
    documentTitle,
  }) {
    return (
      <ConfirmModal
        noCancel
        className="paper-service-confirm-modal"
        confirmLabel="Print Now"
        title="Paper service is required for the following document:"
        onCancelSequence="clearModalSequence"
        onConfirmSequence="navigateToPrintPaperServiceSequence"
      >
        <p>The following document will be served on all parties:</p>

        <p className="text-semibold">{documentTitle}</p>

        <Hint fullWidth className="block">
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
      </ConfirmModal>
    );
  },
);

PaperServiceConfirmModal.displayName = 'PaperServiceConfirmModal';
