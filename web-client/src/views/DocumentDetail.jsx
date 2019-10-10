import { ArchiveDraftDocumentModal } from './DraftDocuments/ArchiveDraftDocumentModal';
import { Button } from '../ustc-ui/Button/Button';
import { CaseDetailEdit } from './CaseDetailEdit/CaseDetailEdit';
import { CaseDetailHeader } from './CaseDetailHeader';
import { CaseDetailReadOnly } from './CaseDetailReadOnly';
import { CompletedMessages } from './DocumentDetail/CompletedMessages';
import { ConfirmEditModal } from './DraftDocuments/ConfirmEditModal';
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
import classNames from 'classnames';

export const DocumentDetail = connect(
  {
    archiveDraftDocumentModalSequence:
      sequences.archiveDraftDocumentModalSequence,
    baseUrl: state.baseUrl,
    caseDetail: state.caseDetail,
    caseHelper: state.caseDetailHelper,
    clickServeToIrsSequence: sequences.clickServeToIrsSequence,
    documentDetailHelper: state.documentDetailHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    gotoOrdersNeededSequence: sequences.gotoOrdersNeededSequence,
    messageId: state.messageId,
    navigateToPathSequence: sequences.navigateToPathSequence,
    openConfirmEditModalSequence: sequences.openConfirmEditModalSequence,
    openServeConfirmModalDialogSequence:
      sequences.openServeConfirmModalDialogSequence,
    removeSignatureFromOrderSequence:
      sequences.removeSignatureFromOrderSequence,
    setModalDialogNameSequence: sequences.setModalDialogNameSequence,
    showModal: state.showModal,
    token: state.token,
  },
  ({
    archiveDraftDocumentModalSequence,
    baseUrl,
    caseDetail,
    caseHelper,
    clickServeToIrsSequence,
    documentDetailHelper,
    formattedCaseDetail,
    gotoOrdersNeededSequence,
    messageId,
    navigateToPathSequence,
    openConfirmEditModalSequence,
    openServeConfirmModalDialogSequence,
    removeSignatureFromOrderSequence,
    setModalDialogNameSequence,
    showModal,
    token,
  }) => {
    const renderParentTabs = () => {
      return (
        <Tabs bind="currentTab" className="no-full-border-bottom tab-button-h2">
          {documentDetailHelper.showDocumentInfoTab && (
            <Tab
              id="tab-document-info"
              tabName="Document Info"
              title="Document Info"
            />
          )}

          <Tab id="tab-pending-messages" tabName="Messages" title="Messages" />
        </Tabs>
      );
    };
    const renderNestedTabs = () => {
      return (
        <Tabs bind="currentTab" className="no-full-border-bottom tab-button-h2">
          {documentDetailHelper.showDocumentInfoTab && (
            <Tab id="tab-document-info" tabName="Document Info">
              <div
                aria-labelledby="tab-document-info"
                id="tab-document-info-panel"
              >
                {documentDetailHelper.showCaseDetailsEdit && <CaseDetailEdit />}
                {documentDetailHelper.showCaseDetailsView && (
                  <CaseDetailReadOnly />
                )}
              </div>
            </Tab>
          )}
          <Tab id="tab-pending-messages" tabName="Messages">
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
                <Tab tabName="completed" title="Complete">
                  <CompletedMessages />
                </Tab>
              </Tabs>
            </div>
          </Tab>
        </Tabs>
      );
    };

    const renderButtons = () => {
      const showingAnyButton = [
        caseHelper.showServeToIrsButton &&
          documentDetailHelper.formattedDocument.isPetition,
        documentDetailHelper.showServeDocumentButton,
        caseHelper.showRecallButton &&
          documentDetailHelper.formattedDocument.isPetition,
        documentDetailHelper.showSignDocumentButton,
      ].some(val => val);

      return (
        <div className="document-detail__action-buttons">
          <div className="float-left">
            {caseHelper.hasOrders &&
              documentDetailHelper.showViewOrdersNeededButton && (
                <Button
                  link
                  onClick={() => {
                    gotoOrdersNeededSequence({
                      docketNumber: caseDetail.docketNumber,
                    });
                  }}
                >
                  View Orders Needed
                </Button>
              )}

            {documentDetailHelper.isDraftDocument && (
              <div>
                {!documentDetailHelper.formattedDocument.signedAt && (
                  <Button
                    link
                    href={documentDetailHelper.formattedDocument.signUrl}
                  >
                    <FontAwesomeIcon icon={['fas', 'pencil-alt']} /> Apply
                    Signature
                  </Button>
                )}
                {documentDetailHelper.showRemoveSignature && (
                  <>
                    Signed{' '}
                    {documentDetailHelper.formattedDocument.signedAtFormattedTZ}
                    <Button
                      link
                      className="margin-left-2"
                      onClick={() =>
                        removeSignatureFromOrderSequence({
                          caseDetail,
                          documentIdToEdit:
                            documentDetailHelper.formattedDocument.documentId,
                        })
                      }
                    >
                      <FontAwesomeIcon icon="trash" size="sm" /> Delete
                      Signature
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="float-right">
            {documentDetailHelper.isDraftDocument && (
              <div
                className={classNames(
                  'display-inline-block margin-right-2',
                  !showingAnyButton && 'margin-top-1',
                )}
              >
                <>
                  {documentDetailHelper.showConfirmEditOrder ? (
                    <Button
                      link
                      icon="edit"
                      onClick={() => {
                        openConfirmEditModalSequence({
                          caseId: formattedCaseDetail.caseId,
                          docketNumber: formattedCaseDetail.docketNumber,
                          documentIdToEdit:
                            documentDetailHelper.formattedDocument.documentId,
                          path: documentDetailHelper.formattedDocument.editUrl,
                        });
                      }}
                    >
                      Edit
                    </Button>
                  ) : (
                    <Button
                      link
                      href={documentDetailHelper.formattedDocument.editUrl}
                      icon="edit"
                    >
                      Edit
                    </Button>
                  )}

                  <Button
                    link
                    className="red-warning margin-right-0"
                    onClick={() => {
                      archiveDraftDocumentModalSequence({
                        caseId: caseDetail.caseId,
                        documentId:
                          documentDetailHelper.formattedDocument.documentId,
                        documentTitle:
                          documentDetailHelper.formattedDocument.documentType,
                        redirectToCaseDetail: true,
                      });
                    }}
                  >
                    <FontAwesomeIcon icon="trash" size="sm" />
                    Delete
                  </Button>
                </>
              </div>
            )}

            {caseHelper.showServeToIrsButton &&
              documentDetailHelper.formattedDocument.isPetition && (
                <Button
                  className="serve-to-irs margin-right-0"
                  onClick={() => clickServeToIrsSequence()}
                >
                  <FontAwesomeIcon icon={['fas', 'clock']} />
                  Serve to IRS
                </Button>
              )}
            {documentDetailHelper.showServeDocumentButton && (
              <Button
                className="serve-to-irs margin-right-0"
                onClick={() => openServeConfirmModalDialogSequence()}
              >
                <FontAwesomeIcon icon={['fas', 'paper-plane']} />
                Serve Document
              </Button>
            )}
            {caseHelper.showRecallButton &&
              documentDetailHelper.formattedDocument.isPetition && (
                <span className="recall-button-box">
                  <FontAwesomeIcon icon={['far', 'clock']} size="lg" />
                  <span className="batched-message">Batched for IRS</span>
                  <Button
                    className="recall-petition"
                    onClick={() =>
                      setModalDialogNameSequence({
                        showModal: 'RecallPetitionModalDialog',
                      })
                    }
                  >
                    Recall
                  </Button>
                </span>
              )}
            {documentDetailHelper.showSignDocumentButton && (
              <Button
                className="serve-to-irs margin-right-0"
                onClick={() =>
                  navigateToPathSequence({
                    path: messageId
                      ? `/case-detail/${caseDetail.docketNumber}/documents/${documentDetailHelper.formattedDocument.documentId}/messages/${messageId}/sign`
                      : `/case-detail/${caseDetail.docketNumber}/documents/${documentDetailHelper.formattedDocument.documentId}/sign`,
                  })
                }
              >
                <FontAwesomeIcon icon={['fas', 'edit']} />
                Sign This Document
              </Button>
            )}
          </div>
        </div>
      );
    };

    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container DocumentDetail">
          <h2 className="heading-1">
            {documentDetailHelper.formattedDocument.documentTitle ||
              documentDetailHelper.formattedDocument.documentType}
            {documentDetailHelper.isDraftDocument && ' - DRAFT'}
          </h2>
          <div className="filed-by">
            <div className="padding-bottom-1">
              Filed {documentDetailHelper.formattedDocument.createdAtFormatted}
              {documentDetailHelper.formattedDocument.filedBy &&
                ` by ${documentDetailHelper.formattedDocument.filedBy}`}
            </div>
            {documentDetailHelper.formattedDocument.showServedAt && (
              <div>
                Served{' '}
                {documentDetailHelper.formattedDocument.servedAtFormatted}
              </div>
            )}
          </div>
          <SuccessNotification />
          <ErrorNotification />
          <div className="grid-container padding-x-0">
            <div className="grid-row grid-gap">
              <div className="grid-col-5">{renderParentTabs()}</div>
              <div className="grid-col-7">{renderButtons()}</div>
            </div>

            <div className="grid-row grid-gap">
              <div className="grid-col-5">{renderNestedTabs()}</div>
              <div className="grid-col-7">
                {/* we can't show the iframe in cypress or else cypress will pause and ask for a save location for the file */}
                {!process.env.CI && (
                  <iframe
                    key={documentDetailHelper.formattedDocument.signedAt}
                    src={`${baseUrl}/documents/${documentDetailHelper.formattedDocument.documentId}/document-download-url?token=${token}`}
                    title={`Document type: ${documentDetailHelper.formattedDocument.documentType}`}
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
            documentType={documentDetailHelper.formattedDocument.documentType}
          />
        )}
        {showModal === 'ArchiveDraftDocumentModal' && (
          <ArchiveDraftDocumentModal />
        )}
        {showModal === 'ConfirmEditModal' && <ConfirmEditModal />}
      </>
    );
  },
);
