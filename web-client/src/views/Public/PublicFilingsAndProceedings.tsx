import { Button } from '../../ustc-ui/Button/Button';
import { PublicFormattedDocketEntryInfo } from '@web-client/presenter/computeds/Public/publicCaseDetailHelper';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

type PublicFilingsAndProceedingsPros = {
  entry: PublicFormattedDocketEntryInfo;
};

const PublicFilingsAndProceedingsDeps = {
  caseDetail: state.caseDetail,
  openCaseDocumentDownloadUrlSequence:
    sequences.openCaseDocumentDownloadUrlSequence,
};

export const PublicFilingsAndProceedings = connect<
  PublicFilingsAndProceedingsPros,
  typeof PublicFilingsAndProceedingsDeps
>(
  PublicFilingsAndProceedingsDeps,
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
