import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { InfoNotificationComponent } from '../InfoNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PaperServiceConfirmModal = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
    documentTitle: state.form.documentTitle,
    confirmInitiateServiceModalHelper: state.confirmInitiateServiceModalHelper,
    clearModalSequence: sequences.clearModalSequence,
    navigateToPrintPaperServiceSequence:
      sequences.navigateToPrintPaperServiceSequence,
  },
  function PaperServiceConfirmModal({
    formattedCaseDetail,
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
        title="Paper Service Required"
        onCancelSequence={clearModalSequence}
        onConfirmSequence={navigateToPrintPaperServiceSequence}
      >
        <p>The following document was served on all cases:</p>

        <p className="text-semibold">
          {documentTitle.includes('Notice for Docket Change')
            ? documentTitle.split(' for ')[0]
            : documentTitle}
        </p>

        <ul>
          {formattedCaseDetail.consolidatedCases.map(
            (c: { docketNumber: string; caseCaption: string }) => (
              <li key={c.docketNumber}>
                <span>{c.docketNumber}</span> - {c.caseCaption}
              </li>
            ),
          )}
        </ul>

        <InfoNotificationComponent
          alertInfo={{
            message: (
              <>
                <div>
                  <strong>Paper service is required for these parties:</strong>
                </div>
                {confirmInitiateServiceModalHelper.paperPartiesConsolidated.map(
                  contact => (
                    <div key={`${contact.docketNumber}-${contact.name}`}>
                      {contact.docketNumber} - {contact.name}
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
