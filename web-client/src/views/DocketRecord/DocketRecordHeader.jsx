import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OpenPrintableDocketRecordModal } from './OpenPrintableDocketRecordModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DocketRecordHeader = connect(
  {
    DOCKET_RECORD_FILTER_OPTIONS: state.constants.DOCKET_RECORD_FILTER_OPTIONS,
    docketRecordHelper: state.docketRecordHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    gotoPrintableDocketRecordSequence:
      sequences.gotoPrintableDocketRecordSequence,
    sessionMetadata: state.sessionMetadata,
    showModal: state.modal.showModal,
    toggleMobileDocketSortSequence: sequences.toggleMobileDocketSortSequence,
    updateSessionMetadataSequence: sequences.updateSessionMetadataSequence,
  },
  function DocketRecordHeader({
    DOCKET_RECORD_FILTER_OPTIONS,
    docketRecordHelper,
    formattedCaseDetail,
    gotoPrintableDocketRecordSequence,
    sessionMetadata,
    showModal,
    toggleMobileDocketSortSequence,
    updateSessionMetadataSequence,
  }) {
    return (
      <React.Fragment>
        <div className="grid-container padding-0 docket-record-header">
          <div className="grid-row grid-gap hide-on-mobile margin-bottom-3">
            <div className="tablet:grid-col-3">
              <select
                aria-label="docket record"
                className="usa-select margin-top-0 sort"
                name={`docketRecordSort.${formattedCaseDetail.docketNumber}`}
                value={
                  sessionMetadata.docketRecordSort[
                    formattedCaseDetail.docketNumber
                  ]
                }
                onChange={e => {
                  updateSessionMetadataSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              >
                {[
                  {
                    label: 'oldest',
                    value: 'byDate',
                  },
                  {
                    label: 'newest',
                    value: 'byDateDesc',
                  },
                  {
                    label: 'no. (ascending)',
                    value: 'byIndex',
                  },
                  {
                    label: 'no. (descending)',
                    value: 'byIndexDesc',
                  },
                ].map(item => (
                  <option key={item.value} value={item.value}>
                    Sort by {item.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="tablet:grid-col-4">
              <label
                className="dropdown-label-serif margin-right-3"
                htmlFor="inline-select"
                id="docket-record-filter-label"
              >
                Filter by
              </label>
              <BindedSelect
                aria-describedby="docket-record-filter-label"
                aria-label="docket record filter"
                bind="sessionMetadata.docketRecordFilter"
                className="select-left inline-select"
                name="docketRecordFilter"
              >
                {Object.entries(DOCKET_RECORD_FILTER_OPTIONS).map(
                  ([key, value]) => (
                    <option key={`filter-${key}`} value={value}>
                      {value}
                    </option>
                  ),
                )}
              </BindedSelect>
            </div>

            {docketRecordHelper.showPrintableDocketRecord && (
              <div className="tablet:grid-col-5 text-right">
                <Button
                  link
                  aria-label="printable docket record"
                  className="margin-right-0"
                  icon="print"
                  id="printable-docket-record-button"
                  onClick={() => {
                    gotoPrintableDocketRecordSequence({
                      docketNumber: formattedCaseDetail.docketNumber,
                    });
                  }}
                >
                  Printable Docket Record
                </Button>
              </div>
            )}
          </div>
          <div className="only-small-screens">
            <Button
              link
              aria-hidden="true"
              className="margin-top-1"
              icon="print"
              onClick={() => {
                gotoPrintableDocketRecordSequence({
                  docketNumber: formattedCaseDetail.docketNumber,
                });
              }}
            >
              Printable Docket Record
            </Button>
            <Button
              link
              aria-label="docket record sort"
              className="mobile-sort-docket-button text-left"
              onClick={() => {
                toggleMobileDocketSortSequence();
              }}
            >
              {docketRecordHelper.sortLabelTextMobile}
              <FontAwesomeIcon icon="sort" size="sm" />
            </Button>
          </div>
        </div>
        {showModal === 'OpenPrintableDocketRecordModal' && (
          <OpenPrintableDocketRecordModal />
        )}
      </React.Fragment>
    );
  },
);

DocketRecordHeader.displayName = 'DocketRecordHeader';
