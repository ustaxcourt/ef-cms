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
              data-testid="print-public-docket-record-button"
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
            filterOptions={PUBLIC_DOCKET_RECORD_FILTER_OPTIONS}
            gotoPrintableDocketRecordSequence={
              gotoPublicPrintableDocketRecordSequence
            }
            sessionMetadata={sessionMetadata}
            updateSessionMetadataSequence={updateSessionMetadataSequence}
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
