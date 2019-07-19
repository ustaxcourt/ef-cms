import { CaseDetailEdit } from './CaseDetailEdit/CaseDetailEdit';
import { CaseDetailHeader } from './CaseDetailHeader';
import { CaseDetailReadOnly } from './CaseDetailReadOnly';
import { CompletedMessages } from './DocumentDetail/CompletedMessages';
import { CreateMessageModalDialog } from './DocumentDetail/CreateMessageModalDialog';
import { ErrorNotification } from './ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PendingMessages } from './DocumentDetail/PendingMessages';
import { RecallPetitionModalDialog } from './RecallPetitionModalDialog';
import { ServeConfirmModalDialog } from './ServeConfirmModalDialog';
import { ServeToIrsModalDialog } from './ServeToIrsModalDialog';
import { SuccessNotification } from './SuccessNotification';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DocumentDetail = connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.caseDetail,
    caseHelper: state.caseDetailHelper,
    clickServeToIrsSequence: sequences.clickServeToIrsSequence,
    helper: state.documentDetailHelper,
    messageId: state.messageId,
    navigateToPathSequence: sequences.navigateToPathSequence,
    openServeConfirmModalDialogSequence:
      sequences.openServeConfirmModalDialogSequence,
    setModalDialogNameSequence: sequences.setModalDialogNameSequence,
    showModal: state.showModal,
    token: state.token,
  },
  ({
    baseUrl,
    caseDetail,
    caseHelper,
    clickServeToIrsSequence,
    helper,
    messageId,
    navigateToPathSequence,
    openServeConfirmModalDialogSequence,
    setModalDialogNameSequence,
    showModal,
    token,
  }) => {
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container DocumentDetail">
          <h2 className="heading-1">{helper.formattedDocument.documentType}</h2>
          <span className="filed-by">
            Filed {helper.formattedDocument.createdAtFormatted}
            {helper.formattedDocument.filedBy &&
              ` by ${helper.formattedDocument.filedBy}`}
          </span>
          <SuccessNotification />
          <ErrorNotification />
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="grid-col-5">
                <Tabs
                  bind="currentTab"
                  className="no-full-border-bottom tab-button-h2"
                >
                  {helper.showDocumentInfoTab && (
                    <Tab
                      id="tab-document-info"
                      tabName="Document Info"
                      title="Document Info"
                    >
                      <div
                        aria-labelledby="tab-document-info"
                        id="tab-document-info-panel"
                      >
                        {helper.showCaseDetailsEdit && <CaseDetailEdit />}
                        {helper.showCaseDetailsView && <CaseDetailReadOnly />}
                      </div>
                    </Tab>
                  )}
                  <Tab
                    id="tab-pending-messages"
                    tabName="Messages"
                    title="Messages"
                  >
                    <div
                      aria-labelledby="tab-pending-messages"
                      id="tab-pending-messages-panel"
                    >
                      <Tabs
                        boxed
                        bind="documentDetail.messagesTab"
                        className="container-tabs no-full-border-bottom tab-button-h3"
                        id="case-detail-messages-tabs"
                      >
                        <Tab
                          id="tab-messages-in-progress"
                          tabName="inProgress"
                          title="In Progress"
                        >
                          <PendingMessages />
                        </Tab>
                        <Tab
                          id="tab-messages-completed"
                          tabName="completed"
                          title="Complete"
                        >
                          <CompletedMessages />
                        </Tab>
                      </Tabs>
                    </div>
                  </Tab>
                </Tabs>
              </div>
              <div
                className={`grid-col-7 ${
                  helper.showDocumentViewerTopMargin
                    ? 'document-viewer-top-margin'
                    : ''
                }`}
              >
                <div className="document-detail__action-buttons float-right">
                  {caseHelper.showServeToIrsButton &&
                    helper.formattedDocument.isPetition && (
                      <button
                        className="usa-button serve-to-irs margin-right-0"
                        onClick={() => clickServeToIrsSequence()}
                      >
                        <FontAwesomeIcon icon={['fas', 'clock']} />
                        Serve to IRS
                      </button>
                    )}
                  {helper.showServeDocumentButton && (
                    <button
                      className="usa-button serve-to-irs margin-right-0"
                      onClick={() => openServeConfirmModalDialogSequence()}
                    >
                      <FontAwesomeIcon icon={['fas', 'paper-plane']} />
                      Serve Document
                    </button>
                  )}
                  {caseHelper.showRecallButton &&
                    helper.formattedDocument.isPetition && (
                      <span className="recall-button-box">
                        <FontAwesomeIcon icon={['far', 'clock']} size="lg" />
                        <span className="batched-message">Batched for IRS</span>
                        <button
                          className="usa-button recall-petition"
                          onClick={() =>
                            setModalDialogNameSequence({
                              showModal: 'RecallPetitionModalDialog',
                            })
                          }
                        >
                          Recall
                        </button>
                      </span>
                    )}
                  {helper.showSignDocumentButton && (
                    <button
                      className="usa-button serve-to-irs margin-right-0"
                      onClick={() =>
                        navigateToPathSequence({
                          path: messageId
                            ? `/case-detail/${caseDetail.docketNumber}/documents/${helper.formattedDocument.documentId}/messages/${messageId}/sign`
                            : `/case-detail/${caseDetail.docketNumber}/documents/${helper.formattedDocument.documentId}/sign`,
                        })
                      }
                    >
                      <FontAwesomeIcon icon={['fas', 'edit']} />
                      Sign This Document
                    </button>
                  )}
                </div>

                {/* we can't show the iframe in cypress or else cypress will pause and ask for a save location for the file */}
                {!process.env.CYPRESS && (
                  <iframe
                    src={`${baseUrl}/documents/${helper.formattedDocument.documentId}/document-download-url?token=${token}`}
                    title={`Document type: ${helper.formattedDocument.documentType}`}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
        {showModal === 'ServeToIrsModalDialog' && <ServeToIrsModalDialog />}
        {showModal === 'RecallPetitionModalDialog' && (
          <RecallPetitionModalDialog />
        )}
        {showModal === 'CreateMessageModalDialog' && (
          <CreateMessageModalDialog />
        )}
        {showModal === 'ServeConfirmModalDialog' && (
          <ServeConfirmModalDialog
            documentType={helper.formattedDocument.documentType}
          />
        )}
      </>
    );
  },
);
