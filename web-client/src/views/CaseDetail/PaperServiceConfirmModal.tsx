import { ConfirmModal } from '@web-client/ustc-ui/Modal/ConfirmModal';
import { InfoNotificationComponent } from '@web-client/views/InfoNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '@shared/business/entities/EntityConstants';
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
      <div>
        <ConfirmModal
          className="paper-service-confirm-modal"
          confirmLabel="Print Now"
          cancelLabel="Close"
          useLinkForCancel={true}
          disableTooltip={true}
          title="Paper Service Required"
          onCancelSequence={clearModalSequence}
          onConfirmSequence={navigateToPrintPaperServiceSequence}
        >
          <p className="margin-0">
            The following document was served on all cases:
          </p>

          <p className="margin-0 text-bold">
            {documentTitle?.includes('Notice of Docket Change')
              ? SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfDocketChange
                  .documentType
              : documentTitle}
          </p>

          <ul className="margin-0 padding-left-3">
            {formattedCaseDetail.consolidatedCases.map(
              (c: { docketNumber: string; caseTitle: string }) => (
                <li key={c.docketNumber}>
                  <span>{c.docketNumber}</span> - {c.caseTitle}
                </li>
              ),
            )}
          </ul>

          {confirmInitiateServiceModalHelper.contactsNeedingPaperService && (
            <InfoNotificationComponent
              alertInfo={{
                message: (
                  <>
                    <div>
                      <strong>
                        {confirmInitiateServiceModalHelper.paperFilingText}
                      </strong>
                    </div>
                    {confirmInitiateServiceModalHelper.contactsNeedingPaperService.map(
                      contact => (
                        <div key={`${contact.docketNumber}-${contact.name}`}>
                          {confirmInitiateServiceModalHelper.shouldAllowMultiDocketing &&
                            `${contact.docketNumber} - `}
                          {contact.name}, {contact.formattedContactType}
                        </div>
                      ),
                    )}
                  </>
                ),
              }}
              dismissible={false}
              scrollToTop={false}
            />
          )}
        </ConfirmModal>
      </div>
    );
  },
);

PaperServiceConfirmModal.displayName = 'PaperServiceConfirmModal';
