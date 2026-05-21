import { WrappedIcon } from '../../ustc-ui/Icon/Icon';
import { Button } from '@web-client/ustc-ui/Button/Button';
import React from 'react';
import { RecentFiling } from '@shared/business/useCases/getRecentFilingsForUserInteractor';

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
  isStricken,
  showProcessing,
}: {
  isStricken: boolean;
  showProcessing: boolean;
}) => (
  <>
    {isStricken && (
      <WrappedIcon
        icon="times-circle"
        iconClass="margin-right-05 text-secondary"
        title="Stricken Document"
        aria-hidden="true"
        data-testid="stricken-document-icon"
      />
    )}
    {showProcessing && (
      <WrappedIcon
        icon="spinner"
        iconClass="margin-right-05 text-secondary fa-spin"
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
  filing,
}: {
  isLink: boolean;
  isViewer: boolean;
  isStricken: boolean;
  documentName: string;
  docketNumber: string;
  onDownloadClick: (filing: RecentFiling) => void;
  showProcessing: boolean;
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
        overrideReadOnly
        onClick={() => onDownloadClick(filing)}
      >
        <StatusIcons isStricken={isStricken} showProcessing={showProcessing} />
        {documentName}
      </Button>
    );
  }

  return (
    <span className={isStricken ? 'stricken-docket-record' : ''}>
      <StatusIcons isStricken={isStricken} showProcessing={showProcessing} />
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

  const { document: documentTitle, eventCode, isStricken } = filing;
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
