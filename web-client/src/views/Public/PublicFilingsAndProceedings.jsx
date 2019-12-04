import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { props, state } from 'cerebral';
import React from 'react';

export const PublicFilingsAndProceedings = connect(
  {
    baseUrl: state.baseUrl,
    caseDetail: state.caseDetail,
    entry: props.entry,
  },
  ({ baseUrl, caseDetail, entry }) => {
    const renderDocumentLink = (documentId, description, isPaper) => {
      return (
        <React.Fragment>
          <React.Fragment>
            <a
              aria-label={`View PDF: ${description}`}
              href={`${baseUrl}/public-api/${caseDetail.caseId}/${documentId}/public-document-download-url`}
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
        </React.Fragment>
      );
    };

    return (
      <React.Fragment>
        {entry.showLinkToDocument &&
          renderDocumentLink(
            entry.documentId,
            entry.description,
            entry.isPaper,
          )}

        {entry.showDocumentDescriptionWithoutLink && entry.descriptionDisplay}

        <span> {entry.signatory}</span>

        {!entry.hasDocument && entry.description}

        <span className="filings-and-proceedings">
          {entry.filingsAndProceedingsWithAdditionalInfo}
        </span>
      </React.Fragment>
    );
  },
);
