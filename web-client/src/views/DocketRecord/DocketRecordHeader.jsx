import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DocketRecordHeader = connect(
  {
    caseDetail: state.formattedCaseDetail,
    helper: state.caseDetailHelper,
    pdfPreviewUrl: state.pdfPreviewUrl,
    printDocketRecord: sequences.printDocketRecordSequence,
    toggleMobileDocketSortSequence: sequences.toggleMobileDocketSortSequence,
    updateSessionMetadataSequence: sequences.updateSessionMetadataSequence,
  },
  ({
    caseDetail,
    helper,
    printDocketRecord,
    toggleMobileDocketSortSequence,
    updateSessionMetadataSequence,
  }) => {
    const openDocketRecordPrintPreview = (options = {}) => {
      updateSessionMetadataSequence({
        key: `docketRecordSort.${caseDetail.caseId}`,
        value: 'byDate',
      });
      printDocketRecord(options);
    };
    return (
      <React.Fragment>
        <div className="grid-container padding-0 docket-record-header">
          <div className="grid-row">
            <div className="tablet:grid-col-10">
              {helper.showAddDocketEntryButton && (
                <a
                  className="usa-button"
                  href={`/case-detail/${caseDetail.docketNumber}/add-docket-entry`}
                  id="button-add-record"
                >
                  <FontAwesomeIcon icon="plus-circle" size="1x" /> Add Docket
                  Entry
                </a>
              )}
              {helper.showFileDocumentButton && (
                <a
                  className="usa-button"
                  href={`/case-detail/${caseDetail.docketNumber}/before-you-file-a-document`}
                  id="button-file-document"
                >
                  <FontAwesomeIcon icon="file" size="1x" /> File a Document
                </a>
              )}
              <button
                aria-hidden="true"
                className="show-on-mobile usa-button usa-button--unstyled margin-top-1 margin-left-2"
                onClick={() => {
                  openDocketRecordPrintPreview({
                    openNewTab: true,
                    openNewView: false,
                  });
                }}
              >
                <FontAwesomeIcon icon="print" size="sm" />
                Printable Docket Record
              </button>
              <button
                aria-label="printable docket record"
                className="hide-on-mobile usa-button usa-button--unstyled margin-top-1 margin-left-2"
                onClick={() => {
                  openDocketRecordPrintPreview();
                }}
              >
                <FontAwesomeIcon icon="print" size="sm" />
                Printable Docket Record
              </button>
            </div>
            <div className="tablet:grid-col-2">
              <div className="only-large-screens">
                <select
                  aria-label="docket record"
                  className="usa-select margin-top-0 margin-bottom-2 sort"
                  name={`docketRecordSort.${caseDetail.caseId}`}
                  value={caseDetail.docketRecordSort}
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
                <div className="margin-top-3 margin-bottom-1">
                  <button
                    aria-label="docket record sort"
                    className="usa-button usa-button--unstyled mobile-sort-docket-button"
                    onClick={() => {
                      toggleMobileDocketSortSequence();
                    }}
                  >
                    {caseDetail.docketRecordSort === 'byDate' &&
                      'Oldest to Newest'}
                    {caseDetail.docketRecordSort === 'byDateDesc' &&
                      'Newest to Oldest'}
                    {caseDetail.docketRecordSort === 'byIndex' &&
                      'Order Ascending'}
                    {caseDetail.docketRecordSort === 'byIndexDesc' &&
                      'Order Descending'}
                    <FontAwesomeIcon icon="sort" size="sm" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
