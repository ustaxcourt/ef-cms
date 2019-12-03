import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { props, state } from 'cerebral';
import React from 'react';

export const PublicFilingsAndProceedings = connect(
  {
    arrayIndex: props.arrayIndex,
    baseUrl: state.baseUrl,
    document: props.document,
    record: props.record,
  },
  ({ baseUrl, document, record }) => {
    const renderDocumentLink = (documentId, description, isPaper) => {
      return (
        <React.Fragment>
          {!document.isInProgress && !document.isNotServedCourtIssuedDocument && (
            <React.Fragment>
              <a
                aria-label={`View PDF: ${description}`}
                href={`${baseUrl}/documents/${documentId}/document-download-url`}
                rel="noreferrer noopener"
                target="_blank"
              >
                {isPaper && (
                  <span className="filing-type-icon-mobile">
                    <FontAwesomeIcon icon={['fas', 'file-alt']} />
                  </span>
                )}
                {description}
              </a>
            </React.Fragment>
          )}
          {document.isInProgress && description}
        </React.Fragment>
      );
    };

    return (
      <React.Fragment>
        {document &&
          document.processingStatus === 'complete' &&
          document.isCourtIssuedDocument &&
          !document.isNotServedCourtIssuedDocument &&
          renderDocumentLink(
            document.documentId,
            record.description,
            document.isPaper,
          )}

        {document &&
          (!document.isCourtIssuedDocument ||
            document.isNotServedCourtIssuedDocument) &&
          (document.documentTitle || record.description)}

        <span> {record.signatory}</span>

        {!document && record.description}

        <span className="filings-and-proceedings">
          {document &&
            document.documentTitle &&
            document.additionalInfo &&
            ` ${document.additionalInfo}`}
          {record.filingsAndProceedings && ` ${record.filingsAndProceedings}`}
          {document &&
            document.additionalInfo2 &&
            ` ${document.additionalInfo2}`}
        </span>
      </React.Fragment>
    );
  },
);
