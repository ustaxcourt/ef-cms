import { Button } from '@web-client/ustc-ui/Button/Button';
import React from 'react';
import { RecentFiling } from '@shared/business/entities/RecentFiling';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DOCKET_ENTRY_SEALED_TO_TYPES } from '@shared/business/entities/EntityConstants';

type RecentFilingsDocumentDisplayProps = {
  filing: RecentFiling;
  displayProperties: {
    showLinkToDocument: boolean;
    showDocumentViewerLink: boolean;
    showDocumentDescriptionWithoutLink: boolean;
    showDocumentProcessing: boolean;
  };
  onDownloadClick: (filing: RecentFiling) => void;
};

const StatusIcons = ({
  isSealed,
  isStricken,
  showProcessing,
  sealedTo,
  caseIsSealed,
}: {
  isSealed: boolean;
  isStricken: boolean;
  showProcessing: boolean;
  sealedTo?: string | null;
  caseIsSealed?: boolean | null;
}) => (
  <>
    {isSealed && (
      <FontAwesomeIcon
        icon="lock"
        className="margin-right-05 text-secondary"
        title={
          sealedTo === DOCKET_ENTRY_SEALED_TO_TYPES.EXTERNAL
            ? 'Sealed to all parties'
            : sealedTo === DOCKET_ENTRY_SEALED_TO_TYPES.PUBLIC
              ? 'Sealed to the public'
              : 'Sealed Document'
        }
        aria-hidden="true"
        data-testid="sealed-document-icon"
      />
    )}
    {caseIsSealed && !isSealed && (
      <FontAwesomeIcon
        icon="lock"
        className="margin-right-05 text-secondary"
        title="Document in sealed case"
        aria-hidden="true"
        data-testid="sealed-case-icon"
      />
    )}
    {isStricken && (
      <FontAwesomeIcon
        icon="times-circle"
        className="margin-right-05 text-secondary"
        title="Stricken Document"
        aria-hidden="true"
        data-testid="stricken-document-icon"
      />
    )}
    {showProcessing && (
      <FontAwesomeIcon
        icon="spinner"
        className="margin-right-05 text-secondary fa-spin"
        title="Processing Document"
        aria-hidden="true"
      />
    )}
  </>
);

const DocumentContent = ({
  isLink = false,
  isViewer = false,
  isStricken,
  documentName,
  docketNumber,
  onDownloadClick,
  showProcessing,
  isSealed,
  sealedTo,
  caseIsSealed,
  filing,
}: {
  isLink: boolean;
  isViewer: boolean;
  isStricken: boolean;
  documentName: string;
  docketNumber: string;
  onDownloadClick: (filing: RecentFiling) => void;
  showProcessing: boolean;
  isSealed: boolean;
  sealedTo?: string | null;
  caseIsSealed?: boolean | null;
  filing: RecentFiling;
}) => {
  const className = `text-left line-height-standard padding-0 ${
    isViewer ? 'view-pdf-link' : ''
  } ${isStricken ? 'stricken-docket-record' : ''}`;

  if (isLink) {
    return (
      <Button
        link
        aria-label={`View PDF document: ${documentName} for case ${docketNumber}`}
        className={className}
        data-testid="document-link"
        onClick={() => onDownloadClick(filing)}
      >
        <StatusIcons
          isSealed={isSealed}
          isStricken={isStricken}
          showProcessing={showProcessing}
          sealedTo={sealedTo}
          caseIsSealed={caseIsSealed}
        />
        {documentName}
      </Button>
    );
  }

  return (
    <span className={isStricken ? 'stricken-docket-record' : ''}>
      <StatusIcons
        isSealed={isSealed}
        isStricken={isStricken}
        showProcessing={showProcessing}
        sealedTo={sealedTo}
        caseIsSealed={caseIsSealed}
      />
      {documentName}
    </span>
  );
};

export const RecentFilingsDocumentDisplay = ({
  filing,
  displayProperties,
  onDownloadClick,
}: RecentFilingsDocumentDisplayProps) => {
  if (!filing || !displayProperties) {
    return <span>Document information unavailable</span>;
  }

  const {
    document: documentTitle,
    eventCode,
    isStricken,
    isSealed,
    sealedTo,
    caseIsSealed,
  } = filing;
  const documentName = documentTitle || eventCode || 'Document';

  const renderContent = () => {
    if (
      displayProperties.showLinkToDocument ||
      displayProperties.showDocumentViewerLink
    ) {
      return (
        <DocumentContent
          isLink={true}
          isViewer={displayProperties.showDocumentViewerLink}
          isStricken={isStricken || false}
          documentName={documentName}
          docketNumber={filing.docketNumber}
          onDownloadClick={onDownloadClick}
          showProcessing={displayProperties.showDocumentProcessing}
          isSealed={isSealed || false}
          sealedTo={sealedTo}
          caseIsSealed={caseIsSealed}
          filing={filing}
        />
      );
    }

    if (displayProperties.showDocumentProcessing) {
      return (
        <>
          <span aria-label="document uploading marker" className="usa-tag">
            Processing
          </span>
          <DocumentContent
            isLink={false}
            isViewer={false}
            isStricken={isStricken || false}
            documentName={documentName}
            docketNumber={filing.docketNumber}
            onDownloadClick={onDownloadClick}
            showProcessing={displayProperties.showDocumentProcessing}
            isSealed={isSealed || false}
            sealedTo={sealedTo}
            caseIsSealed={caseIsSealed}
            filing={filing}
          />
        </>
      );
    }

    if (displayProperties.showDocumentDescriptionWithoutLink) {
      return (
        <span aria-label={`Document not accessible: ${documentName}`}>
          <DocumentContent
            isLink={false}
            isViewer={false}
            isStricken={isStricken || false}
            documentName={documentName}
            docketNumber={filing.docketNumber}
            onDownloadClick={onDownloadClick}
            showProcessing={displayProperties.showDocumentProcessing}
            isSealed={isSealed || false}
            sealedTo={sealedTo}
            caseIsSealed={caseIsSealed}
            filing={filing}
          />
        </span>
      );
    }

    return (
      <DocumentContent
        isLink={false}
        isViewer={false}
        isStricken={isStricken || false}
        documentName={documentName}
        docketNumber={filing.docketNumber}
        onDownloadClick={onDownloadClick}
        showProcessing={displayProperties.showDocumentProcessing}
        isSealed={isSealed || false}
        sealedTo={sealedTo}
        caseIsSealed={caseIsSealed}
        filing={filing}
      />
    );
  };

  return (
    <>
      {renderContent()}
      {isStricken && <span data-testid="stricken-document">(STRICKEN)</span>}
    </>
  );
};
