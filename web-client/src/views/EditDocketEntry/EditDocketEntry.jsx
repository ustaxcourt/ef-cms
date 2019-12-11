import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { CreateMessageModalDialog } from '../DocumentDetail/CreateMessageModalDialog';
import { DocumentDetailHeader } from '../DocumentDetail/DocumentDetailHeader';
import { DocumentDisplayIframe } from '../DocumentDetail/DocumentDisplayIframe';
import { DocumentMessages } from '../DocumentDetail/DocumentMessages';
import { ErrorNotification } from '../ErrorNotification';
import { FileUploadErrorModal } from '../FileUploadErrorModal';
import { FileUploadStatusModal } from '../FileUploadStatusModal';
import { FormCancelModalDialog } from '../FormCancelModalDialog';
import { PrimaryDocumentForm } from './PrimaryDocumentForm';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditDocketEntry = connect(
  {
    completeDocketEntryQCSequence: sequences.completeDocketEntryQCSequence,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    openCreateMessageAlongsideDocketRecordQCModalSequence:
      sequences.openCreateMessageAlongsideDocketRecordQCModalSequence,
    showModal: state.showModal,
  },
  ({
    completeDocketEntryQCSequence,
    formCancelToggleCancelSequence,
    openCreateMessageAlongsideDocketRecordQCModalSequence,
    showModal,
  }) => {
    return (
      <>
        <CaseDetailHeader />

        <section className="usa-section grid-container">
          <DocumentDetailHeader />
          <SuccessNotification />
          <ErrorNotification />

          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="grid-col-5">
                <Tabs
                  bind="currentTab"
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
                  bind="currentTab"
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
                      openCreateMessageAlongsideDocketRecordQCModalSequence();
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
        {showModal === 'CreateMessageAlongsideDocketRecordQCModal' && (
          <CreateMessageModalDialog onConfirmSequence="completeDocketEntryQCAndSendMessageSequence" />
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
