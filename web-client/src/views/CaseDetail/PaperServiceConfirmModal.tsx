import { ConfirmModal } from '@web-client/ustc-ui/Modal/ConfirmModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import { SYSTEM_GENERATED_DOCUMENT_TYPES } from '@shared/business/entities/EntityConstants';
import { AlertInfo } from '@web-client/dawson-ui/ui/Alert/AlertInfo';
import React from 'react';

export const PaperServiceConfirmModal = connect(
  {
    documentTitle: state.form.documentTitle,
    confirmPaperServiceModalHelper: state.confirmPaperServiceModalHelper,
    clearModalSequence: sequences.clearModalSequence,
    navigateToPrintPaperServiceSequence:
      sequences.navigateToPrintPaperServiceSequence,
  },
  function PaperServiceConfirmModal({
    clearModalSequence,
    confirmPaperServiceModalHelper,
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
          {/* 8477 TODO: Come back ask UX about this, make sure language works for both groups
          and single cases */}
          <p className="margin-0">
            The following document was served on all parties:
          </p>

          <p className="margin-0 text-bold">
            {documentTitle?.includes('Notice of Docket Change')
              ? SYSTEM_GENERATED_DOCUMENT_TYPES.noticeOfDocketChange
                  .documentType
              : documentTitle}
          </p>

          <ul className="margin-0 padding-left-3">
            {confirmPaperServiceModalHelper.multiDocketedOn.map(
              (c: { docketNumber: string; caseTitle: string }) => (
                <li key={c.docketNumber}>
                  <span>{c.docketNumber}</span> - {c.caseTitle}
                </li>
              ),
            )}
          </ul>

          {confirmPaperServiceModalHelper.contactsNeedingPaperService && (
            <AlertInfo
              alertInfo={{
                message: (
                  <>
                    <div>
                      <strong>
                        {confirmPaperServiceModalHelper.paperFilingText}
                      </strong>
                    </div>
                    {confirmPaperServiceModalHelper.contactsNeedingPaperService.map(
                      contact => (
                        <div key={`${contact.docketNumber}-${contact.name}`}>
                          {confirmPaperServiceModalHelper.wasMultiDocketed &&
                            `${contact.docketNumber} - `}
                          {contact.name}, {contact.formattedContactType}
                        </div>
                      ),
                    )}
                  </>
                ),
              }}
              isDismissible={false}
              scrollToTop={false}
              className="tw:mt-6"
            />
          )}
        </ConfirmModal>
      </div>
    );
  },
);

PaperServiceConfirmModal.displayName = 'PaperServiceConfirmModal';
