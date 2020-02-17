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
    return (
      <React.Fragment>
        {entry.showLinkToDocument && (
          <a
            aria-label={`View PDF: ${entry.description}`}
            href={`${baseUrl}/public-api/${caseDetail.caseId}/${entry.documentId}/public-document-download-url`}
            rel="noreferrer noopener"
            target="_blank"
          >
            {entry.isPaper && (
              <span className="filing-type-icon-mobile">
                <FontAwesomeIcon icon={['fas', 'file-alt']} />
              </span>
            )}
            {entry.description}
          </a>
        )}

        {entry.showDocumentDescriptionWithoutLink && entry.descriptionDisplay}

        <span> {entry.signatory}</span>

        <span className="filings-and-proceedings">
          {entry.filingsAndProceedingsWithAdditionalInfo}
        </span>
      </React.Fragment>
    );
  },
);
