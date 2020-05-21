import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CorrespondenceHeader = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
    navigateToPrintableDocketRecordSequence:
      sequences.navigateToPrintableDocketRecordSequence,
    printDocketRecordSequence: sequences.printDocketRecordSequence,
    toggleMobileDocketSortSequence: sequences.toggleMobileDocketSortSequence,
    updateSessionMetadataSequence: sequences.updateSessionMetadataSequence,
  },
  function CorrespondenceHeader({
    formattedCaseDetail,
    printDocketRecordSequence,
    updateSessionMetadataSequence,
  }) {
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
          <div className="title grid-row">
            <div className="grid-col-10">
              <h1>Correspondence Files</h1>
            </div>
            <div className="tablet:grid-col-2 text-right hide-on-mobile add-correspondence-file">
              <Button
                link
                aria-label="printable docket record"
                className="margin-right-0"
                href={`/case-detail/${formattedCaseDetail.docketNumber}/upload-correspondence`}
                icon="envelope-open"
              >
                Add Correspondence File
              </Button>
            </div>
            <div className="only-small-screens">
              <Button
                link
                aria-hidden="true"
                icon="print"
                onClick={() => {
                  openDocketRecordPrintPreview({
                    openNewTab: true,
                    openNewView: false,
                  });
                }}
              >
                Add Correspondence File
              </Button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
