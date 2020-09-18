import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

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
            aria-label={`View PDF: ${entry.descriptionDisplay}`}
            onClick={() => {
              openCaseDocumentDownloadUrlSequence({
                docketEntryId: entry.docketEntryId,
                docketNumber: caseDetail.docketNumber,
                isPublic: true,
              });
            }}
          >
            {entry.isPaper && (
              <span className="filing-type-icon-mobile">
                <FontAwesomeIcon icon={['fas', 'file-alt']} />
              </span>
            )}
            {entry.descriptionDisplay}
          </Button>
        )}

        <span
          className={classNames(entry.isStricken && 'stricken-docket-record')}
        >
          {entry.showDocumentDescriptionWithoutLink && entry.descriptionDisplay}
        </span>

        <span
          className={classNames(entry.isStricken && 'stricken-docket-record')}
        >
          {entry.signatory}
        </span>

        <span className="filings-and-proceedings">
          {entry.filingsAndProceedingsWithAdditionalInfo}
        </span>

        {entry.isStricken && <span> (STRICKEN)</span>}
      </React.Fragment>
    );
  },
);
