import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const PublicFilingsAndProceedings = connect(
  {
    caseDetail: state.caseDetail,
    entry: props.entry,
    openCaseDocumentDownloadUrlSequence:
      sequences.openCaseDocumentDownloadUrlSequence,
  },
  function PublicFilingsAndProceedings({
    caseDetail,
    entry,
    openCaseDocumentDownloadUrlSequence,
  }) {
    return (
      <React.Fragment>
        {entry.showLinkToDocument && (
          <Button
            link
            aria-label={`View PDF: ${entry.description}`}
            onClick={() => {
              openCaseDocumentDownloadUrlSequence({
                docketNumber: caseDetail.docketNumber,
                documentId: entry.documentId,
                isPublic: true,
              });
            }}
          >
            {entry.isPaper && (
              <span className="filing-type-icon-mobile">
                <FontAwesomeIcon icon={['fas', 'file-alt']} />
              </span>
            )}
            {entry.description}
          </Button>
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
