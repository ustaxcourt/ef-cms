import { Button } from '../../ustc-ui/Button/Button';
import { OpenPrintableDocketRecordModal } from '../DocketRecord/OpenPrintableDocketRecordModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PublicDocketRecordHeader = connect(
  {
    docketNumber: state.caseDetail.docketNumber,
    gotoPublicPrintableDocketRecordSequence:
      sequences.gotoPublicPrintableDocketRecordSequence,
    publicCaseDetailHelper: state.publicCaseDetailHelper,
    showModal: state.modal.showModal,
  },
  function PublicDocketRecordHeader({
    docketNumber,
    gotoPublicPrintableDocketRecordSequence,
    publicCaseDetailHelper,
    showModal,
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
                gotoPublicPrintableDocketRecordSequence({
                  docketNumber,
                });
              }}
            >
              Printable Docket Record
            </Button>
          )}
        </div>
        <div className="grid-container padding-0 docket-record-header">
          <div className="grid-row margin-bottom-2">
            <div className="tablet:grid-col-10">
              <Button
                link
                aria-hidden="true"
                className="show-on-mobile margin-top-1 text-left"
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
        </div>
        {showModal === 'OpenPrintableDocketRecordModal' && (
          <OpenPrintableDocketRecordModal />
        )}
      </React.Fragment>
    );
  },
);
