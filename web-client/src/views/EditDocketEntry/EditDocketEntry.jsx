import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { CreateCaseMessageModalDialog } from '../Messages/CreateCaseMessageModalDialog';
import { DocumentDetailHeader } from '../DocumentDetail/DocumentDetailHeader';
import { DocumentDisplayIframe } from '../DocumentDetail/DocumentDisplayIframe';
import { DocumentMessages } from '../DocumentDetail/DocumentMessages';
import { ErrorNotification } from '../ErrorNotification';
import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { Hint } from '../../ustc-ui/Hint/Hint';
import { PrimaryDocumentForm } from './PrimaryDocumentForm';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditDocketEntry = connect(
  {
    completeDocketEntryQCSequence: sequences.completeDocketEntryQCSequence,
    editDocketEntryHelper: state.editDocketEntryHelper,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    openCompleteAndSendCaseMessageModalSequence:
      sequences.openCompleteAndSendCaseMessageModalSequence,
    showModal: state.modal.showModal,
  },
  function EditDocketEntry({
    completeDocketEntryQCSequence,
    editDocketEntryHelper,
    formCancelToggleCancelSequence,
    openCompleteAndSendCaseMessageModalSequence,
    showModal,
  }) {
    return (
      <>
        <CaseDetailHeader />

        <section className="usa-section grid-container">
          {editDocketEntryHelper.showPaperServiceWarning && (
            <Hint exclamation fullWidth>
              This document was automatically generated and requires paper
              service
            </Hint>
          )}
          <DocumentDetailHeader />
          <SuccessNotification />
          <ErrorNotification />

          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="grid-col-5">
                <Tabs
                  bind="currentViewMetadata.tab"
                  className="no-full-border-bottom tab-button-h2"
                >
                  <Tab
                    id="tab-document-info"
                    tabName="Document Info"
                    title="Document Info"
                  />
                  <Tab
                    id="tab-pending-messages"
                    tabName="Messages"
                    title="Messages"
                  />
                </Tabs>
              </div>
              <div className="grid-col-7"></div>
            </div>

            <div className="grid-row grid-gap">
              <div className="grid-col-5">
                <Tabs
                  asSwitch
                  bind="currentViewMetadata.tab"
                  className="no-full-border-bottom tab-button-h2"
                >
                  <Tab id="tab-document-info" tabName="Document Info">
                    <div
                      aria-labelledby="tab-document-info"
                      id="tab-document-info-panel"
                    >
                      <PrimaryDocumentForm />
                    </div>
                  </Tab>
                  <Tab id="tab-pending-messages" tabName="Messages">
                    <div
                      aria-labelledby="tab-pending-messages"
                      id="tab-pending-messages-panel"
                    >
                      <DocumentMessages />
                    </div>
                  </Tab>
                </Tabs>
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
                      openCompleteAndSendCaseMessageModalSequence();
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
          <FormCancelModalDialog onCancelSequence="closeModalAndReturnToCaseDetailSequence" />
        )}
        {showModal === 'CreateCaseMessageModalDialog' && (
          <CreateCaseMessageModalDialog
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
