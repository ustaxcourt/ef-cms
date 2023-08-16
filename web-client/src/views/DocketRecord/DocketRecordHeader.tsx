import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { DocketRecordSort } from './DocketRecordSort';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { OpenPrintableDocketRecordModal } from './OpenPrintableDocketRecordModal';
import { connect } from '@cerebral/react';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
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
          <NonMobile>
            <div className="grid-row grid-gap hide-on-mobile margin-bottom-3">
              <div className="tablet:grid-col-3">
                <DocketRecordSort
                  name={`docketRecordSort.${formattedCaseDetail.docketNumber}`}
                  value={
                    sessionMetadata.docketRecordSort[
                      formattedCaseDetail.docketNumber
                    ]
                  }
                  onChange={updateSessionMetadataSequence}
                />
              </div>
              <div className="tablet:grid-col-fill">
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
                  className="select-left inline-select docket-record-filter"
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
                <div className="tablet:grid-col-4 text-right">
                  <Button
                    link
                    aria-label="printable docket record"
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
          </NonMobile>

          <Mobile>
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

            <div className="grid-row padding-y-075-rem">
              <div className="grid-col-auto">
                <label
                  className="dropdown-label-serif margin-right-2"
                  htmlFor="docket-record-filter"
                  id="docket-record-filter-label"
                >
                  Filter by
                </label>
              </div>
              <div className="grid-col-fill">
                <BindedSelect
                  aria-describedby="docket-record-filter-label"
                  aria-label="docket record filter"
                  bind="sessionMetadata.docketRecordFilter"
                  id="docket-record-filter"
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
            </div>

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
          </Mobile>
        </div>
        {showModal === 'OpenPrintableDocketRecordModal' && (
          <OpenPrintableDocketRecordModal />
        )}
      </React.Fragment>
    );
  },
);

DocketRecordHeader.displayName = 'DocketRecordHeader';
