import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { InfoNotificationComponent } from '../InfoNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PaperServiceConfirmModal = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
    confirmInitiateServiceModalHelper: state.confirmInitiateServiceModalHelper,
    documentTitle: state.form.documentTitle,
    navigateToPrintPaperServiceSequence:
      sequences.navigateToPrintPaperServiceSequence,
  },
  function PaperServiceConfirmModal({
    clearModalSequence,
    confirmInitiateServiceModalHelper,
    documentTitle,
    navigateToPrintPaperServiceSequence,
  }) {
    return (
      <ConfirmModal
        noCancel
        className="paper-service-confirm-modal"
        confirmLabel="Print Now"
        disableTooltip={true}
        title="Paper service is required for the following document:"
        onCancelSequence={clearModalSequence}
        onConfirmSequence={navigateToPrintPaperServiceSequence}
      >
        <p>The following document will be served on all parties:</p>

        <p className="text-semibold">{documentTitle}</p>

        <InfoNotificationComponent
          alertInfo={{
            message: (
              <>
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
              </>
            ),
          }}
          dismissible={false}
          scrollToTop={false}
        />
      </ConfirmModal>
    );
  },
);

PaperServiceConfirmModal.displayName = 'PaperServiceConfirmModal';
