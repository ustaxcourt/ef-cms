import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { DocketRecordSort } from './DocketRecordSort';
import { NonPhone, Phone } from '../../ustc-ui/Responsive/Responsive';
import { OpenPrintableDocketRecordModal } from './OpenPrintableDocketRecordModal';
import { STATE_KEYS } from '@shared/business/entities/EntityConstants';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const DocketRecordMobileHeader = ({
  docketNumber,
  docketRecordTableSortData,
  filterOptions,
  gotoPrintableDocketRecordSequence,
  sortTableSequence,
  totalCount,
}: {
  docketNumber: string;
  filterOptions: Record<string, string>;
  gotoPrintableDocketRecordSequence: (options: {
    docketNumber: string;
  }) => void;
  docketRecordTableSortData: {
    sortField: string;
    sortOrder: 'asc' | 'desc';
  };
  sortTableSequence: (props: {
    sortField: string;
    sortOrder: 'asc' | 'desc';
    stateKey?: string;
  }) => void;
  totalCount: number;
}) => {
  const { sortField, sortOrder } = docketRecordTableSortData;
  const CURRENTLY_SELECTED_KEY = Object.entries(SORTING_CONVERSION_DICTIONARY)
    .filter(entries => {
      const value = entries[1];
      return value.sortField === sortField && value.sortOrder === sortOrder;
    })
    .map(([key]) => key);

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
            value={CURRENTLY_SELECTED_KEY}
            onChange={option => {
              sortTableSequence({
                ...SORTING_CONVERSION_DICTIONARY[option.value],
                stateKey: STATE_KEYS.DOCKET_RECORD_TABLE_SORT,
              });
            }}
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
        <div className="padding-top-1 margin-top-auto margin-bottom-auto margin-left-auto">
          <span className="text-semibold">Count: </span>
          <span> {totalCount}</span>
        </div>
      </div>
    </div>
  );
};

export const NonMobileHeaderControls = ({
  filterOptions,
  docketRecordCount,
}: {
  filterOptions: Record<string, string>;
  docketRecordCount: number;
}) => {
  return (
    <>
      <label
        className="dropdown-label-serif margin-right-3 margin-bottom-0"
        htmlFor="document-filter-by"
        id="docket-record-filter-label"
      >
        Filter by
      </label>
      {/* @ts-ignore: BindedSelect expects children */}
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
      <span className="text-semibold text-align-right">Count: </span>
      <span>{docketRecordCount || 0}</span>
    </>
  );
};

type DocketRecordHeaderProps = {
  docketRecordTableSortData: {
    sortField: string;
    sortOrder: 'asc' | 'desc';
  };
};

const DocketRecordHeaderDeps = {
  DOCKET_RECORD_FILTER_OPTIONS: state.constants.DOCKET_RECORD_FILTER_OPTIONS,
  docketRecordHelper: state.docketRecordHelper,
  docketRecordCount: state.docketRecordHelper.docketRecordCount,
  formattedCaseDetail: state.formattedCaseDetail,
  formattedDocketEntriesHelper: state.formattedDocketEntries,
  gotoPrintableDocketRecordSequence:
    sequences.gotoPrintableDocketRecordSequence,
  openDownloadDocketEntriesModalSequence:
    sequences.openDownloadDocketEntriesModalSequence,
  showModal: state.modal.showModal,
  sortTableSequence: sequences.sortTableSequence,
  toggleMobileDocketSortSequence: sequences.toggleMobileDocketSortSequence,
};

export const DocketRecordHeader = connect<
  DocketRecordHeaderProps,
  typeof DocketRecordHeaderDeps
>(
  DocketRecordHeaderDeps,
  function DocketRecordHeader({
    DOCKET_RECORD_FILTER_OPTIONS,
    docketRecordHelper,
    docketRecordCount,
    docketRecordTableSortData,
    formattedCaseDetail,
    formattedDocketEntriesHelper,
    gotoPrintableDocketRecordSequence,
    openDownloadDocketEntriesModalSequence,
    showModal,
    sortTableSequence,
  }) {
    return (
      <React.Fragment>
        <div className="grid-container padding-0 docket-record-header">
          <NonPhone>
            <div className="grid-container padding-0 docket-record-header">
              <div className="grid-row grid-gap margin-bottom-2">
                <div className="desktop:grid-col-8 tablet:grid-col-12 display-flex flex-align-center">
                  <NonMobileHeaderControls
                    filterOptions={DOCKET_RECORD_FILTER_OPTIONS}
                    docketRecordCount={docketRecordCount}
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
                  {docketRecordHelper.showBatchDownloadControls && (
                    <Button
                      link
                      aria-label="download docket records"
                      data-testid="download-docket-records-button"
                      disabled={
                        !formattedDocketEntriesHelper.isDownloadLinkEnabled
                      }
                      icon={['fas', 'cloud-download-alt']}
                      onClick={() => openDownloadDocketEntriesModalSequence()}
                    >
                      Download
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </NonPhone>

          <Phone>
            <DocketRecordMobileHeader
              docketNumber={formattedCaseDetail.docketNumber}
              docketRecordTableSortData={docketRecordTableSortData}
              filterOptions={DOCKET_RECORD_FILTER_OPTIONS}
              gotoPrintableDocketRecordSequence={
                gotoPrintableDocketRecordSequence
              }
              sortTableSequence={sortTableSequence}
              totalCount={docketRecordCount}
            />
          </Phone>
        </div>
        {showModal === 'OpenPrintableDocketRecordModal' && (
          <OpenPrintableDocketRecordModal />
        )}
      </React.Fragment>
    );
  },
);

DocketRecordHeader.displayName = 'DocketRecordHeader';

const SORTING_CONVERSION_DICTIONARY = {
  byDate: {
    sortField: 'sortingFilingDate',
    sortOrder: 'asc',
  },
  byDateDesc: {
    sortField: 'sortingFilingDate',
    sortOrder: 'desc',
  },
  byIndex: {
    sortField: 'index',
    sortOrder: 'asc',
  },
  byIndexDesc: {
    sortField: 'index',
    sortOrder: 'desc',
  },
};
