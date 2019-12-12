import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DocketRecordHeader = connect(
  {
    docketRecordHelper: state.docketRecordHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    navigateToPrintableDocketRecordSequence:
      sequences.navigateToPrintableDocketRecordSequence,
    pdfPreviewUrl: state.pdfPreviewUrl,
    printDocketRecordSequence: sequences.printDocketRecordSequence,
    toggleMobileDocketSortSequence: sequences.toggleMobileDocketSortSequence,
    updateSessionMetadataSequence: sequences.updateSessionMetadataSequence,
  },
  ({
    docketRecordHelper,
    formattedCaseDetail,
    navigateToPrintableDocketRecordSequence,
    printDocketRecordSequence,
    toggleMobileDocketSortSequence,
    updateSessionMetadataSequence,
  }) => {
    const openDocketRecordPrintPreview = (options = {}) => {
      updateSessionMetadataSequence({
        key: `docketRecordSort.${formattedCaseDetail.caseId}`,
        value: 'byDate',
      });
      printDocketRecordSequence(options);
    };
    return (
      <React.Fragment>
        <div className="grid-container padding-0 docket-record-header">
          <div className="grid-row">
            <div className="tablet:grid-col-10">
              {docketRecordHelper.showFileDocumentButton && (
                <Button
                  href={`/case-detail/${formattedCaseDetail.docketNumber}/before-you-file-a-document`}
                  id="button-file-document"
                >
                  <FontAwesomeIcon icon="file" size="1x" /> File a Document
                </Button>
              )}
              <Button
                link
                aria-hidden="true"
                className="show-on-mobile margin-top-1 margin-left-2"
                onClick={() => {
                  openDocketRecordPrintPreview({
                    openNewTab: true,
                    openNewView: false,
                  });
                }}
              >
                <FontAwesomeIcon icon="print" size="sm" />
                Printable Docket Record
              </Button>
              <Button
                link
                aria-label="printable docket record"
                className="hide-on-mobile margin-top-1 margin-left-2"
                onClick={() => {
                  navigateToPrintableDocketRecordSequence({
                    docketNumber: formattedCaseDetail.docketNumber,
                  });
                }}
              >
                <FontAwesomeIcon icon="print" size="sm" />
                Printable Docket Record
              </Button>
            </div>
            <div className="tablet:grid-col-2 padding-top-1">
              <div className="only-large-screens">
                <select
                  aria-label="docket record"
                  className="usa-select margin-top-0 margin-bottom-2 sort"
                  name={`docketRecordSort.${formattedCaseDetail.caseId}`}
                  value={formattedCaseDetail.docketRecordSort}
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
                      label: 'No. (Ascending)',
                      value: 'byIndex',
                    },
                    {
                      label: 'No. (Descending)',
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
                  <Button
                    link
                    aria-label="docket record sort"
                    className="mobile-sort-docket-button"
                    onClick={() => {
                      toggleMobileDocketSortSequence();
                    }}
                  >
                    {formattedCaseDetail.docketRecordSort === 'byDate' &&
                      'Oldest to Newest'}
                    {formattedCaseDetail.docketRecordSort === 'byDateDesc' &&
                      'Newest to Oldest'}
                    {formattedCaseDetail.docketRecordSort === 'byIndex' &&
                      'Order Ascending'}
                    {formattedCaseDetail.docketRecordSort === 'byIndexDesc' &&
                      'Order Descending'}
                    <FontAwesomeIcon icon="sort" size="sm" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
