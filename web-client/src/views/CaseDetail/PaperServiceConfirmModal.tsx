import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { InfoNotificationComponent } from '../InfoNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '@shared/business/entities/EntityConstants';
import React from 'react';
import { Button } from '@web-client/ustc-ui/Button/Button';

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
      <div>
        <ConfirmModal
          noCancel
          className="paper-service-confirm-modal"
          confirmLabel="Print Now"
          disableTooltip={true}
          title="Paper Service Required"
          onCancelSequence={clearModalSequence}
          onConfirmSequence={navigateToPrintPaperServiceSequence}
        >
          <span>
            <p>The following document was served on all cases:</p>
          </span>

          <div>
            <p className="text-semibold">
              {documentTitle.includes('Notice of Docket Change')
                ? SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfDocketChange
                    .documentType
                : documentTitle}
            </p>
          </div>

          <ul>
            {formattedCaseDetail.consolidatedCases.map(
              (c: { docketNumber: string; caseTitle: string }) => (
                <li key={c.docketNumber}>
                  <span>{c.docketNumber}</span> - {c.caseTitle}
                </li>
              ),
            )}
          </ul>

          <InfoNotificationComponent
            alertInfo={{
              message: (
                <>
                  <div>
                    <strong>
                      Paper service is required for these parties:
                    </strong>
                  </div>
                  {confirmInitiateServiceModalHelper.paperPartiesConsolidated.map(
                    contact => (
                      <div key={`${contact.docketNumber}-${contact.name}`}>
                        {contact.docketNumber} - {contact.name},{' '}
                        {contact.contactType}
                      </div>
                    ),
                  )}
                </>
              ),
            }}
            dismissible={false}
            scrollToTop={false}
          />
          <div>
            <Button
              data-testid="confirm-modal-close-btn"
              link
              className="text-no-underline float-right"
              onClick={event => {
                event.stopPropagation();
                clearModalSequence();
              }}
            >
              Close
            </Button>
          </div>
        </ConfirmModal>
      </div>
    );
  },
);

PaperServiceConfirmModal.displayName = 'PaperServiceConfirmModal';
