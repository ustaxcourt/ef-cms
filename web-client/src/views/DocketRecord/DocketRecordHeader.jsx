import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DocketRecordHeader = connect(
  {
    caseDetail: state.formattedCaseDetail,
    helper: state.caseDetailHelper,
    sessionMetadata: state.sessionMetadata,
    toggleMobileDocketSortSequence: sequences.toggleMobileDocketSortSequence,
    updateSessionMetadataSequence: sequences.updateSessionMetadataSequence,
  },
  ({
    caseDetail,
    helper,
    sessionMetadata,
    toggleMobileDocketSortSequence,
    updateSessionMetadataSequence,
  }) => {
    return (
      <React.Fragment>
        <div className="usa-grid-full add-bottom-margin">
          {helper.showAddDocketEntryButton && (
            <div className="usa-width-two-thirds">
              <a
                className="usa-button tablet-full-width"
                href={`/case-detail/${
                  caseDetail.docketNumber
                }/add-docket-entry`}
                id="button-add-record"
              >
                <FontAwesomeIcon icon="plus-circle" size="sm" /> Add Docket
                Entry
              </a>
            </div>
          )}
          {helper.showFileDocumentButton && (
            <div className="usa-width-two-thirds">
              <a
                className="usa-button tablet-full-width"
                href={`/case-detail/${caseDetail.docketNumber}/file-a-document`}
                id="button-file-document"
              >
                <FontAwesomeIcon icon="cloud-upload-alt" /> File Document
              </a>
            </div>
          )}
          <div className="usa-width-one-sixth">
            <div className="only-large-screens">
              <select
                name="docketRecordSort"
                onChange={e => {
                  updateSessionMetadataSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              >
                {[
                  {
                    label: 'Oldest',
                    value: 'byDate',
                  },
                  {
                    label: 'Newest',
                    value: 'byDateDesc',
                  },
                  {
                    label: 'Index (Ascending)',
                    value: 'byIndex',
                  },
                  {
                    label: 'Index (Descending)',
                    value: 'byIndexDesc',
                  },
                ].map(item => (
                  <option key={item.value} value={item.value}>
                    Sort By {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="only-small-screens">
              <button
                className="link mobile-sort-docket-button"
                onClick={() => {
                  toggleMobileDocketSortSequence();
                }}
              >
                {(!sessionMetadata.docketRecordSort ||
                  sessionMetadata.docketRecordSort === 'byDate') &&
                  'Oldest to Newest'}
                {sessionMetadata.docketRecordSort &&
                  sessionMetadata.docketRecordSort === 'byDateDesc' &&
                  'Newest to Oldest'}
                <FontAwesomeIcon icon="sort" size="sm" />
              </button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
