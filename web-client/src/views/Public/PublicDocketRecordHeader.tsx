import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { DocketRecordSort } from '../DocketRecord/DocketRecordSort';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { OpenPrintableDocketRecordModal } from '../DocketRecord/OpenPrintableDocketRecordModal';
import { connect } from '@cerebral/react';
import { sequences } from '@web-client/presenter/app-public.cerebral';
import { state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';

const props = {
  PUBLIC_DOCKET_RECORD_FILTER_OPTIONS:
    state.constants.PUBLIC_DOCKET_RECORD_FILTER_OPTIONS,
  docketNumber: state.caseDetail.docketNumber,
  gotoPublicPrintableDocketRecordSequence:
    sequences.gotoPublicPrintableDocketRecordSequence,
  publicCaseDetailHelper: state.publicCaseDetailHelper,
  sessionMetadata: state.sessionMetadata,
  showModal: state.modal.showModal,
  updateSessionMetadataSequence: sequences.updateSessionMetadataSequence,
};

export const PublicDocketRecordHeader = connect(
  props,
  function ({
    docketNumber,
    gotoPublicPrintableDocketRecordSequence,
    PUBLIC_DOCKET_RECORD_FILTER_OPTIONS,
    publicCaseDetailHelper,
    sessionMetadata,
    showModal,
    updateSessionMetadataSequence,
  }: typeof props & {
    publicCaseDetailHelper: ReturnType<typeof state.publicCaseDetailHelper>;
  }) {
    return (
      <React.Fragment>
        <div className="title">
          <h1>Docket Record</h1>
          {publicCaseDetailHelper.showPrintableDocketRecord && (
            <Button
              link
              className="hide-on-mobile float-right margin-right-0 margin-top-1"
              icon="print"
              id="printable-docket-record-button"
              onClick={() => {
                gotoPublicPrintableDocketRecordSequence({ docketNumber });
              }}
            >
              Printable Docket Record
            </Button>
          )}
        </div>

        <NonMobile>
          <div className="grid-container padding-0 docket-record-header">
            <div className="grid-row grid-gap margin-bottom-2">
              <div className="grid-col-12 display-flex flex-align-center">
                <label
                  className="dropdown-label-serif margin-right-3 margin-bottom-0"
                  htmlFor="docket-record-sort"
                  id="docket-record-sort-label"
                >
                  Sort by
                </label>
                <div className="margin-right-3">
                  <DocketRecordSort
                    name={`docketRecordSort.${docketNumber}`}
                    value={sessionMetadata.docketRecordSort[docketNumber]}
                    onChange={updateSessionMetadataSequence}
                  />
                </div>
                <label
                  className="dropdown-label-serif margin-right-3 margin-bottom-0"
                  htmlFor="document-filter-by"
                  id="docket-record-filter-label"
                >
                  Filter by
                </label>
                <BindedSelect
                  aria-describedby="docket-record-filter-label"
                  aria-label="docket record filter"
                  bind="sessionMetadata.docketRecordFilter"
                  className="select-left inline-select"
                  id="document-filter-by"
                  name="docketRecordFilter"
                  style={{ maxWidth: 180 }}
                >
                  {Object.entries(PUBLIC_DOCKET_RECORD_FILTER_OPTIONS).map(
                    ([key, value]) => (
                      <option key={`filter-${key}`} value={value}>
                        {value}
                      </option>
                    ),
                  )}
                </BindedSelect>
              </div>
            </div>
          </div>
        </NonMobile>

        <Mobile>
          <div className="grid-container padding-0 docket-record-header">
            <div className="grid-row">
              <div className="grid-col-4">
                <label
                  className="dropdown-label-serif margin-right-2"
                  htmlFor="docket-record-sort"
                  id="docket-record-sort-label"
                >
                  Sort by
                </label>
              </div>
              <div className="grid-col-fill">
                <DocketRecordSort
                  name={`docketRecordSort.${docketNumber}`}
                  value={sessionMetadata.docketRecordSort[docketNumber]}
                  onChange={updateSessionMetadataSequence}
                />
              </div>
            </div>

            <div className="grid-row padding-y-075-rem">
              <div className="grid-col-4">
                <label
                  className="dropdown-label-serif"
                  htmlFor="document-filter-by"
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
                  id="document-filter-by"
                  name="docketRecordFilter"
                >
                  {Object.entries(PUBLIC_DOCKET_RECORD_FILTER_OPTIONS).map(
                    ([key, value]) => (
                      <option key={`filter-${key}`} value={value}>
                        {value}
                      </option>
                    ),
                  )}
                </BindedSelect>
              </div>
            </div>
            <div className="grid-row">
              <Button
                link
                aria-hidden="true"
                className="margin-top-1 text-left"
                icon="print"
                onClick={() => {
                  gotoPublicPrintableDocketRecordSequence({
                    docketNumber,
                  });
                }}
              >
                Printable Docket Record
              </Button>
            </div>
          </div>
        </Mobile>

        {showModal === 'OpenPrintableDocketRecordModal' && (
          <OpenPrintableDocketRecordModal />
        )}
      </React.Fragment>
    );
  },
);

PublicDocketRecordHeader.displayName = 'PublicDocketRecordHeader';
