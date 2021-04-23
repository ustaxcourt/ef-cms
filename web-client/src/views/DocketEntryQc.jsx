import { Button } from '../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetail/CaseDetailHeader';
import { CreateMessageModalDialog } from './Messages/CreateMessageModalDialog';
import { DocumentDisplayIframe } from './DocumentDisplayIframe';
import { ErrorNotification } from './ErrorNotification';
import { FileUploadErrorModal } from './FileUploadErrorModal';
import { FileUploadStatusModal } from './FileUploadStatusModal';
import { FormCancelModalDialog } from './FormCancelModalDialog';
import { Hint } from '../ustc-ui/Hint/Hint';
import { PrimaryDocumentForm } from './EditDocketEntry/PrimaryDocumentForm';
import { SuccessNotification } from './SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DocketEntryQc = connect(
  {
    completeDocketEntryQCSequence: sequences.completeDocketEntryQCSequence,
    docketEntryQcHelper: state.docketEntryQcHelper,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    openCompleteAndSendMessageModalSequence:
      sequences.openCompleteAndSendMessageModalSequence,
    showModal: state.modal.showModal,
  },
  function DocketEntryQc({
    completeDocketEntryQCSequence,
    docketEntryQcHelper,
    formCancelToggleCancelSequence,
    openCompleteAndSendMessageModalSequence,
    showModal,
  }) {
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container">
          {docketEntryQcHelper.showPaperServiceWarning && (
            <Hint exclamation fullWidth>
              This document was automatically generated and requires paper
              service
            </Hint>
          )}
          <h2 className="heading-1">
            {docketEntryQcHelper.formattedDocketEntry.documentTitle ||
              docketEntryQcHelper.formattedDocketEntry.documentType}
          </h2>
          <div className="filed-by">
            <div className="padding-bottom-1">
              Filed{' '}
              {docketEntryQcHelper.formattedDocketEntry.createdAtFormatted}
              {docketEntryQcHelper.formattedDocketEntry.filedBy &&
                ` by ${docketEntryQcHelper.formattedDocketEntry.filedBy}`}
            </div>
            {docketEntryQcHelper.formattedDocketEntry.showServedAt && (
              <div>
                Served{' '}
                {docketEntryQcHelper.formattedDocketEntry.servedAtFormatted}
              </div>
            )}
            {docketEntryQcHelper.formattedDocketEntry.showLegacySealed && (
              <div>Sealed in Blackstone</div>
            )}
          </div>

          <SuccessNotification />
          <ErrorNotification />

          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="grid-col-5">
                <PrimaryDocumentForm />

                <div className="margin-top-5">
                  <Button
                    id="save-and-finish"
                    type="submit"
                    onClick={() => {
                      completeDocketEntryQCSequence();
                    }}
                  >
                    Complete
                  </Button>
                  <Button
                    secondary
                    id="save-and-add-supporting"
                    onClick={() => {
                      openCompleteAndSendMessageModalSequence();
                    }}
                  >
                    Complete &amp; Send Message
                  </Button>
                  <Button
                    link
                    id="cancel-button"
                    onClick={() => {
                      formCancelToggleCancelSequence();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
              <div className="grid-col-7">
                <DocumentDisplayIframe />
              </div>
            </div>
          </div>
        </section>
        {showModal === 'FormCancelModalDialog' && (
          <FormCancelModalDialog onCancelSequence="closeModalAndNavigateBackSequence" />
        )}
        {showModal === 'CreateMessageModalDialog' && (
          <CreateMessageModalDialog
            title="Complete and Send Message"
            onConfirmSequence="completeDocketEntryQCAndSendMessageSequence"
          />
        )}
        {showModal === 'FileUploadStatusModal' && <FileUploadStatusModal />}
        {showModal === 'FileUploadErrorModal' && (
          <FileUploadErrorModal
            confirmSequence={completeDocketEntryQCSequence}
          />
        )}
      </>
    );
  },
);
