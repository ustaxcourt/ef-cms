import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { DocketRecordSort } from './DocketRecordSort';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { OpenPrintableDocketRecordModal } from './OpenPrintableDocketRecordModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const DocketRecordMobileHeader = ({
  docketNumber,
  filterOptions,
  gotoPrintableDocketRecordSequence,
  sessionMetadata,
  updateSessionMetadataSequence,
}: {
  docketNumber: string;
  filterOptions: Record<string, string>;
  gotoPrintableDocketRecordSequence: (options: {
    docketNumber: string;
  }) => void;
  sessionMetadata: any;
  updateSessionMetadataSequence: () => void;
}) => {
  return (
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
            {Object.entries(filterOptions).map(([key, value]) => (
              <option key={`filter-${key}`} value={value}>
                {value}
              </option>
            ))}
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
            gotoPrintableDocketRecordSequence({
              docketNumber,
            });
          }}
        >
          Printable Docket Record
        </Button>
      </div>
    </div>
  );
};

export const NonMobileHeaderControls = ({
  docketNumber,
  filterOptions,
  sessionMetadata,
  updateSessionMetadataSequence,
}: {
  docketNumber: string;
  filterOptions: Record<string, string>;
  sessionMetadata: any;
  updateSessionMetadataSequence: () => void;
}) => {
  return (
    <>
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
        {Object.entries(filterOptions).map(([key, value]) => (
          <option key={`filter-${key}`} value={value}>
            {value}
          </option>
        ))}
      </BindedSelect>
    </>
  );
};

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
    updateSessionMetadataSequence,
  }) {
    return (
      <React.Fragment>
        <div className="grid-container padding-0 docket-record-header">
          <NonMobile>
            <div className="grid-container padding-0 docket-record-header">
              <div className="grid-row grid-gap margin-bottom-2">
                <div className="desktop:grid-col-8 tablet:grid-col-12 display-flex flex-align-center">
                  <NonMobileHeaderControls
                    docketNumber={formattedCaseDetail.docketNumber}
                    filterOptions={DOCKET_RECORD_FILTER_OPTIONS}
                    sessionMetadata={sessionMetadata}
                    updateSessionMetadataSequence={
                      updateSessionMetadataSequence
                    }
                  />
                </div>
                <div className="desktop:grid-col-4 tablet:grid-col-12 tablet:margin-top-2 text-right">
                  {docketRecordHelper.showPrintableDocketRecord && (
                    <Button
                      link
                      aria-label="printable docket record"
                      data-testid="print-docket-record-button"
                      icon="print"
                      onClick={() => {
                        gotoPrintableDocketRecordSequence({
                          docketNumber: formattedCaseDetail.docketNumber,
                        });
                      }}
                    >
                      Printable Docket Record
                    </Button>
                  )}
                  {docketRecordHelper.showDownloadLink && (
                    <Button
                      link
                      aria-label="download docket records"
                      data-testid="download-docket-records-button"
                      disabled={docketRecordHelper.isDownloadButtonLinkDisabled}
                      icon={['fas', 'cloud-download-alt']}
                      onClick={() => {
                        // gotoPrintableDocketRecordSequence({
                        //   docketNumber: formattedCaseDetail.docketNumber,
                        // });
                      }}
                    >
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </NonMobile>

          <Mobile>
            <DocketRecordMobileHeader
              docketNumber={formattedCaseDetail.docketNumber}
              filterOptions={DOCKET_RECORD_FILTER_OPTIONS}
              gotoPrintableDocketRecordSequence={
                gotoPrintableDocketRecordSequence
              }
              sessionMetadata={sessionMetadata}
              updateSessionMetadataSequence={updateSessionMetadataSequence}
            />
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
