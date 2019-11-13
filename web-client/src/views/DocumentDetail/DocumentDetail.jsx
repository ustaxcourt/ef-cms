import { ArchiveDraftDocumentModal } from '../DraftDocuments/ArchiveDraftDocumentModal';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailEdit } from '../CaseDetailEdit/CaseDetailEdit';
import { CaseDetailHeader } from '../CaseDetailHeader';
import { CaseDetailReadOnly } from '../CaseDetailReadOnly';
import { ConfirmEditModal } from '../DraftDocuments/ConfirmEditModal';
import { DocumentDetailHeader } from './DocumentDetailHeader';
import { DocumentDisplayIframe } from './DocumentDisplayIframe';
import { DocumentMessages } from './DocumentMessages';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { RecallPetitionModalDialog } from '../RecallPetitionModalDialog';
import { ServeConfirmModalDialog } from '../ServeConfirmModalDialog';
import { ServeToIrsModalDialog } from '../ServeToIrsModalDialog';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DocumentDetail = connect(
  {
    caseDetail: state.caseDetail,
    caseDetailHelper: state.caseDetailHelper,
    clickServeToIrsSequence: sequences.clickServeToIrsSequence,
    documentDetailHelper: state.documentDetailHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    gotoAddCourtIssuedDocketEntrySequence:
      sequences.gotoAddCourtIssuedDocketEntrySequence,
    gotoOrdersNeededSequence: sequences.gotoOrdersNeededSequence,
    messageId: state.messageId,
    navigateToPathSequence: sequences.navigateToPathSequence,
    navigateToPrintableCaseConfirmationSequence:
      sequences.navigateToPrintableCaseConfirmationSequence,
    openServeConfirmModalDialogSequence:
      sequences.openServeConfirmModalDialogSequence,
    removeSignatureFromOrderSequence:
      sequences.removeSignatureFromOrderSequence,
    setModalDialogNameSequence: sequences.setModalDialogNameSequence,
    showModal: state.showModal,
  },
  ({
    caseDetail,
    caseDetailHelper,
    clickServeToIrsSequence,
    documentDetailHelper,
    formattedCaseDetail,
    gotoAddCourtIssuedDocketEntrySequence,
    gotoOrdersNeededSequence,
    messageId,
    navigateToPathSequence,
    navigateToPrintableCaseConfirmationSequence,
    openServeConfirmModalDialogSequence,
    removeSignatureFromOrderSequence,
    setModalDialogNameSequence,
    showModal,
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
              <DocumentMessages />
            </div>
          </Tab>
        </Tabs>
      );
    };

    const renderButtons = () => {
      return (
        <div className="document-detail__action-buttons">
          <div className="float-left">
            {caseDetailHelper.hasOrders &&
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
                      <FontAwesomeIcon icon="trash" size="sm" />
                      Delete Signature
                    </Button>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="float-right">
            {documentDetailHelper.showAddDocketEntryButton && (
              <Button
                className="margin-right-0"
                onClick={() => {
                  gotoAddCourtIssuedDocketEntrySequence({
                    docketNumber: caseDetail.docketNumber,
                    documentId:
                      documentDetailHelper.formattedDocument.documentId,
                  });
                }}
              >
                <FontAwesomeIcon
                  className="margin-right-05"
                  icon="print"
                  size="1x"
                />
                Add Docket Entry
              </Button>
            )}

            {documentDetailHelper.showEditDocketEntry && (
              <Button
                link
                className="margin-right-0 padding-bottom-0"
                href={`/case-detail/${caseDetail.docketNumber}/documents/${documentDetailHelper.formattedDocument.documentId}/edit`}
              >
                <FontAwesomeIcon icon={['fas', 'edit']} />
                Edit
              </Button>
            )}

            {documentDetailHelper.showPrintCaseConfirmationButton && (
              <Button
                className="margin-right-0"
                onClick={() => {
                  navigateToPrintableCaseConfirmationSequence({
                    docketNumber: formattedCaseDetail.docketNumber,
                  });
                }}
              >
                <FontAwesomeIcon
                  className="margin-right-05"
                  icon="print"
                  size="1x"
                />
                Print Confirmation
              </Button>
            )}

            {documentDetailHelper.showServeToIrsButton && (
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
            {documentDetailHelper.showRecallButton && (
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
          <DocumentDetailHeader />
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
                <DocumentDisplayIframe />
              </div>
            </div>
          </div>
        </section>
        {showModal === 'ServeToIrsModalDialog' && <ServeToIrsModalDialog />}
        {showModal === 'RecallPetitionModalDialog' && (
          <RecallPetitionModalDialog />
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
