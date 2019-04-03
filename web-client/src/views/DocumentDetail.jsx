import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

import { CaseDetailEdit } from './CaseDetailEdit/CaseDetailEdit';
import { CaseDetailHeader } from './CaseDetailHeader';
import { CaseDetailReadOnly } from './CaseDetailReadOnly';
import { CompletedMessages } from './DocumentDetail/CompletedMessages';
import { CreateMessageModalDialog } from './DocumentDetail/CreateMessageModalDialog';
import { ErrorNotification } from './ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PendingMessages } from './DocumentDetail/PendingMessages';
import { RecallPetitionModalDialog } from './RecallPetitionModalDialog';
import { ServeToIrsModalDialog } from './ServeToIrsModalDialog';
import { SuccessNotification } from './SuccessNotification';
import { Tab, Tabs } from '../ustc-ui/Tabs/Tabs';

export const DocumentDetail = connect(
  {
    baseUrl: state.baseUrl,
    caseHelper: state.caseDetailHelper,
    clickServeToIrsSequence: sequences.clickServeToIrsSequence,
    helper: state.documentDetailHelper,
    setModalDialogNameSequence: sequences.setModalDialogNameSequence,
    showModal: state.showModal,
    token: state.token,
  },
  ({
    baseUrl,
    caseHelper,
    clickServeToIrsSequence,
    helper,
    setModalDialogNameSequence,
    showModal,
    token,
  }) => {
    return (
      <React.Fragment>
        <div className="usa-grid breadcrumb">
          <FontAwesomeIcon icon="caret-left" />
          <a href="/" id="queue-nav">
            Back
          </a>
        </div>
        <section className="usa-section usa-grid DocumentDetail">
          <CaseDetailHeader />
          <hr aria-hidden="true" />
          <h2 className="heading-1">{helper.formattedDocument.documentType}</h2>

          <SuccessNotification />
          <ErrorNotification />

          <div className="usa-grid-full">
            <div className="usa-width-five-twelfths">
              <Tabs className="classic-horizontal-header3" bind="currentTab">
                {helper.showDocumentInfoTab && (
                  <Tab
                    tabName="Document Info"
                    title="Document Info"
                    id="tab-document-info"
                  >
                    <div
                      id="tab-document-info-panel"
                      aria-labelledby="tab-document-info"
                      tabIndex="0"
                    >
                      {helper.showCaseDetailsEdit && <CaseDetailEdit />}
                      {helper.showCaseDetailsView && <CaseDetailReadOnly />}
                    </div>
                  </Tab>
                )}
                <Tab
                  tabName="Messages"
                  title="Messages"
                  id="tab-pending-messages"
                >
                  <div
                    id="tab-pending-messages-panel"
                    aria-labelledby="tab-pending-messages"
                    tabIndex="0"
                  >
                    <Tabs
                      className="container-tabs"
                      id="case-detail-messages-tabs"
                      bind="documentDetail.messagesTab"
                    >
                      <Tab
                        tabName="inProgress"
                        title="In Progress"
                        id="tab-messages-in-progress"
                      >
                        <PendingMessages />
                      </Tab>
                      <Tab
                        tabName="completed"
                        title="Complete"
                        id="tab-messages-completed"
                      >
                        <CompletedMessages />
                      </Tab>
                    </Tabs>
                  </div>
                </Tab>
              </Tabs>
            </div>
            <div className="usa-width-seven-twelfths">
              <div className="top-bar clear-both">
                <div className="full-width">
                  <span className="filed-by">
                    Filed {helper.formattedDocument.createdAtFormatted} by{' '}
                    {helper.formattedDocument.filedBy}
                  </span>
                  <span className="float-right">
                    {caseHelper.showServeToIrsButton &&
                      helper.formattedDocument.isPetition && (
                        <button
                          className="serve-to-irs"
                          onClick={() => clickServeToIrsSequence()}
                        >
                          <FontAwesomeIcon icon={['far', 'clock']} />
                          Serve to IRS
                        </button>
                      )}
                    {caseHelper.showRecallButton &&
                      helper.formattedDocument.isPetition && (
                        <span className="recall-button-box">
                          <FontAwesomeIcon icon={['far', 'clock']} />
                          Batched for IRS
                          <button
                            className="recall-petition"
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
                  </span>
                </div>
              </div>
              {/* we can't show the iframe in cypress or else cypress will pause and ask for a save location for the file */}
              {!process.env.CYPRESS && (
                <iframe
                  title={`Document type: ${
                    helper.formattedDocument.documentType
                  }`}
                  src={`${baseUrl}/documents/${
                    helper.formattedDocument.documentId
                  }/documentDownloadUrl?token=${token}`}
                />
              )}
            </div>
          </div>
        </section>
        <div tabIndex="0" />
        {showModal === 'ServeToIrsModalDialog' && <ServeToIrsModalDialog />}
        {showModal === 'RecallPetitionModalDialog' && (
          <RecallPetitionModalDialog />
        )}
        {showModal === 'CreateMessageModalDialog' && (
          <CreateMessageModalDialog />
        )}
        <div tabIndex="0" />
      </React.Fragment>
    );
  },
);
