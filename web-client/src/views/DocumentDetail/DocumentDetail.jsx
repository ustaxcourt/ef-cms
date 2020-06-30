import { ArchiveDraftDocumentModal } from '../DraftDocuments/ArchiveDraftDocumentModal';
import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from '../CaseDetail/CaseDetailHeader';
import { ConfirmEditModal } from '../DraftDocuments/ConfirmEditModal';
import { DocumentDetailHeader } from './DocumentDetailHeader';
import { DocumentDisplayIframe } from './DocumentDisplayIframe';
import { DocumentMessages } from './DocumentMessages';
import { ErrorNotification } from '../ErrorNotification';
import { SuccessNotification } from '../SuccessNotification';
import { Tab, Tabs } from '../../ustc-ui/Tabs/Tabs';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DocumentDetail = connect(
  {
    caseDetail: state.caseDetail,
    documentDetailHelper: state.documentDetailHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    messageId: state.currentViewMetadata.messageId,
    navigateToPathSequence: sequences.navigateToPathSequence,
    navigateToPrintableCaseConfirmationSequence:
      sequences.navigateToPrintableCaseConfirmationSequence,
    removeSignatureFromOrderSequence:
      sequences.removeSignatureFromOrderSequence,
    showModal: state.modal.showModal,
  },
  function DocumentDetail({
    caseDetail,
    documentDetailHelper,
    formattedCaseDetail,
    messageId,
    navigateToPathSequence,
    navigateToPrintableCaseConfirmationSequence,
    removeSignatureFromOrderSequence,
    showModal,
  }) {
    const renderParentTabs = () => {
      return (
        <Tabs
          bind="currentViewMetadata.tab"
          className="no-full-border-bottom tab-button-h2"
        >
          <Tab id="tab-pending-messages" tabName="Messages" title="Messages" />
        </Tabs>
      );
    };
    const renderNestedTabs = () => {
      return (
        <Tabs
          bind="currentViewMetadata.tab"
          className="no-full-border-bottom tab-button-h2"
        >
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
            {documentDetailHelper.isDraftDocument && (
              <div>
                {!documentDetailHelper.formattedDocument.signedAt && (
                  <Button
                    link
                    href={documentDetailHelper.formattedDocument.signUrl}
                    icon={['fas', 'pencil-alt']}
                  >
                    Apply Signature
                  </Button>
                )}
                {documentDetailHelper.showSignedAt && (
                  <>
                    Signed{' '}
                    {documentDetailHelper.formattedDocument.signedAtFormattedTZ}
                    {documentDetailHelper.showRemoveSignature && (
                      <Button
                        link
                        className="margin-left-2 no-wrap"
                        icon="trash"
                        onClick={() =>
                          removeSignatureFromOrderSequence({
                            caseDetail,
                            documentIdToEdit:
                              documentDetailHelper.formattedDocument.documentId,
                          })
                        }
                      >
                        Delete Signature
                      </Button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
          <div className="float-right">
            {documentDetailHelper.showAddCourtIssuedDocketEntryButton && (
              <Button
                className="margin-right-0"
                href={`/case-detail/${caseDetail.docketNumber}/documents/${documentDetailHelper.formattedDocument.documentId}/add-court-issued-docket-entry`}
                icon="plus-circle"
              >
                Add Docket Entry
              </Button>
            )}

            {documentDetailHelper.showEditDocketEntry && (
              <Button
                link
                className="margin-right-0 padding-bottom-0"
                href={`/case-detail/${caseDetail.docketNumber}/documents/${documentDetailHelper.formattedDocument.documentId}/edit`}
                icon={['fas', 'edit']}
              >
                Edit
              </Button>
            )}

            {documentDetailHelper.showEditCourtIssuedDocketEntry && (
              <Button
                link
                className="margin-right-0 padding-bottom-0"
                href={`/case-detail/${caseDetail.docketNumber}/documents/${documentDetailHelper.formattedDocument.documentId}/edit-court-issued`}
                icon={['fas', 'edit']}
              >
                Edit
              </Button>
            )}
            {documentDetailHelper.showPrintCaseConfirmationButton && (
              <Button
                className="margin-right-0"
                icon="print"
                onClick={() => {
                  navigateToPrintableCaseConfirmationSequence({
                    docketNumber: formattedCaseDetail.docketNumber,
                  });
                }}
              >
                Print Confirmation
              </Button>
            )}
            {documentDetailHelper.showSignDocumentButton && (
              <Button
                className="serve-to-irs margin-right-0"
                icon={['fas', 'edit']}
                onClick={() =>
                  navigateToPathSequence({
                    path: messageId
                      ? `/case-detail/${caseDetail.docketNumber}/documents/${documentDetailHelper.formattedDocument.documentId}/messages/${messageId}/sign`
                      : `/case-detail/${caseDetail.docketNumber}/documents/${documentDetailHelper.formattedDocument.documentId}/sign`,
                  })
                }
              >
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
        {showModal === 'ArchiveDraftDocumentModal' && (
          <ArchiveDraftDocumentModal />
        )}
        {showModal === 'ConfirmEditModal' && (
          <ConfirmEditModal confirmSequence="navigateToEditOrderSequence" />
        )}
      </>
    );
  },
);
