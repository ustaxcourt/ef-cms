import { Button } from '../../ustc-ui/Button/Button';
import { Phone } from '../../ustc-ui/Responsive/Responsive';
import { PublicFormattedDocketEntryInfo } from '@web-client/presenter/computeds/Public/publicCaseDetailHelper';
import { WrappedIcon } from '../../ustc-ui/Icon/Icon';
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
        <Phone>
          {entry.isSealed && (
            <span className="tw:inline-flex tw:mr-2">
              <WrappedIcon
                iconClass="sealed-in-blackstone icon-sealed"
                icon="lock"
                title={entry.sealedToTooltip}
              />
            </span>
          )}
        </Phone>
        {entry.showLinkToDocument && (
          <Button
            link
            aria-label={`View PDF: ${entry.descriptionDisplay}`}
            className={classNames('text-left', 'view-pdf-link')}
            data-testid="Filing-and-Proceedings-link-to-docket-entry"
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

        {entry.relatedDocketEntries?.map(affectedEntry => {
          return (
            <span key={affectedEntry.docketEntryId}>
              <br></br>
              <span> --- </span>
              {renderDispositionLinks(
                affectedEntry,
                caseDetail.docketNumber,
                openCaseDocumentDownloadUrlSequence,
              )}
            </span>
          );
        })}
      </React.Fragment>
    );
  },
);

const renderDispositionLinks = (
  affectedEntry,
  docketNumber,
  openDocumentDownloadSequence,
) => {
  return affectedEntry.dispositionLinkText.map(linkText => (
    <span className="display-block" key={linkText}>
      {affectedEntry.showDownloadLink && (
        <Button
          link
          className={classNames('text-right', 'view-pdf-link')}
          data-testid={`related-document-viewer-link-${affectedEntry.docketEntryIndex}`}
          aria-label={`View PDF for: ${affectedEntry.docketEntryIndex}`}
          onClick={() =>
            openDocumentDownloadSequence({
              docketEntryId: affectedEntry.docketEntryId,
              docketNumber,
              isPublic: true,
              useSameTab: affectedEntry.openInSameTab,
            })
          }
        >
          {linkText}
        </Button>
      )}
      {!affectedEntry.showDownloadLink && <span> {linkText} </span>}
    </span>
  ));
};
