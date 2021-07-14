import { Button } from '../../ustc-ui/Button/Button';
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
            className={classNames('text-left', 'view-pdf-link')}
            onClick={() => {
              openCaseDocumentDownloadUrlSequence({
                docketEntryId: entry.docketEntryId,
                docketNumber: caseDetail.docketNumber,
                isPublic: true,
                useSameTab: true,
              });
            }}
          >
            {entry.descriptionDisplay}
          </Button>
        )}

        <span
          className={classNames(entry.isStricken && 'stricken-docket-record')}
        >
          <span>
            {entry.showDocumentDescriptionWithoutLink &&
              entry.descriptionDisplay}
          </span>

          <span>{entry.signatory}</span>

          <span className="filings-and-proceedings">
            {entry.filingsAndProceedingsWithAdditionalInfo}
          </span>
        </span>

        {entry.isStricken && <span> (STRICKEN)</span>}
      </React.Fragment>
    );
  },
);
