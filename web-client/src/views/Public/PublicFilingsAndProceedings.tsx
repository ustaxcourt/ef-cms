import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
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
                useSameTab: entry.openInSameTab,
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
        </span>

        {entry.isStricken && <span> (STRICKEN)</span>}
      </React.Fragment>
    );
  },
);

PublicFilingsAndProceedings.displayName = 'PublicFilingsAndProceedings';
