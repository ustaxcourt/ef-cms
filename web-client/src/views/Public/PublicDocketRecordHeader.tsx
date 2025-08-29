import { Button } from '../../ustc-ui/Button/Button';
import {
  DocketRecordMobileHeader,
  NonMobileHeaderControls,
} from '../DocketRecord/DocketRecordHeader';
import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { OpenPrintableDocketRecordModal } from '../DocketRecord/OpenPrintableDocketRecordModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app-public.cerebral';
import { state } from '@web-client/presenter/app-public.cerebral';
import React from 'react';

type PublicDocketRecordHeaderProps = {
  docketRecordTableSortData: {
    sortField: string;
    sortOrder: 'asc' | 'desc';
  };
};

const PublicDocketRecordHeaderDep = {
  PUBLIC_DOCKET_RECORD_FILTER_OPTIONS:
    state.constants.PUBLIC_DOCKET_RECORD_FILTER_OPTIONS,
  docketNumber: state.caseDetail.docketNumber,
  gotoPublicPrintableDocketRecordSequence:
    sequences.gotoPublicPrintableDocketRecordSequence,
  publicCaseDetailHelper: state.publicCaseDetailHelper,
  sessionMetadata: state.sessionMetadata,
  showModal: state.modal.showModal,
  sortTableSequence: sequences.sortTableSequence,
  updateSessionMetadataSequence: sequences.updateSessionMetadataSequence,
};

export const PublicDocketRecordHeader = connect<
  PublicDocketRecordHeaderProps,
  typeof PublicDocketRecordHeaderDep
>(
  PublicDocketRecordHeaderDep,
  function ({
    docketNumber,
    docketRecordTableSortData,
    gotoPublicPrintableDocketRecordSequence,
    PUBLIC_DOCKET_RECORD_FILTER_OPTIONS,
    publicCaseDetailHelper,
    sessionMetadata,
    showModal,
    sortTableSequence,
    updateSessionMetadataSequence,
  }) {
    return (
      <React.Fragment>
        <div className="title display-flex">
          <h1>Docket Record</h1>
          {publicCaseDetailHelper.showPrintableDocketRecord && (
            <Button
              link
              className="hide-on-mobile margin-right-2 margin-left-auto"
              data-testid="print-public-docket-record-button"
              icon="print"
              onClick={() => {
                gotoPublicPrintableDocketRecordSequence({ docketNumber });
              }}
            >
              Printable Docket Record
            </Button>
          )}
          <div className="hide-on-mobile margin-top-auto margin-bottom-auto">
            <span className="text-semibold">Count: </span>
            <span>
              {
                publicCaseDetailHelper.formattedDocketEntriesOnDocketRecord
                  .length
              }
            </span>
          </div>
        </div>

        <NonMobile>
          <div className="grid-container padding-0 docket-record-header">
            <div className="grid-row grid-gap margin-bottom-2">
              <div className="grid-col-12 display-flex flex-align-center">
                <NonMobileHeaderControls
                  docketNumber={docketNumber}
                  filterOptions={PUBLIC_DOCKET_RECORD_FILTER_OPTIONS}
                  sessionMetadata={sessionMetadata}
                  updateSessionMetadataSequence={updateSessionMetadataSequence}
                />
              </div>
            </div>
          </div>
        </NonMobile>

        <Mobile>
          <DocketRecordMobileHeader
            docketNumber={docketNumber}
            docketRecordTableSortData={docketRecordTableSortData}
            filterOptions={PUBLIC_DOCKET_RECORD_FILTER_OPTIONS}
            gotoPrintableDocketRecordSequence={
              gotoPublicPrintableDocketRecordSequence
            }
            sortTableSequence={sortTableSequence}
            totalCount={
              publicCaseDetailHelper.formattedDocketEntriesOnDocketRecord.length
            }
          />
        </Mobile>

        {showModal === 'OpenPrintableDocketRecordModal' && (
          <OpenPrintableDocketRecordModal />
        )}
      </React.Fragment>
    );
  },
);

PublicDocketRecordHeader.displayName = 'PublicDocketRecordHeader';
