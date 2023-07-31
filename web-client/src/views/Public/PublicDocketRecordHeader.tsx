import { BindedSelect } from '../../ustc-ui/BindedSelect/BindedSelect';
import { Button } from '../../ustc-ui/Button/Button';
import { OpenPrintableDocketRecordModal } from '../DocketRecord/OpenPrintableDocketRecordModal';
import { connect } from '@cerebral/react';
import { sequences } from '@web-client/presenter/app.cerebral';
import { statePublic as state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const props = {
  PUBLIC_DOCKET_RECORD_FILTER_OPTIONS:
    state.constants.PUBLIC_DOCKET_RECORD_FILTER_OPTIONS,
  docketNumber: state.caseDetail.docketNumber,
  gotoPublicPrintableDocketRecordSequence:
    sequences.gotoPublicPrintableDocketRecordSequence,
  publicCaseDetailHelper:
    state.publicCaseDetailHelper as unknown as IPublicCaseDetailHelper,
  showModal: state.modal.showModal,
};

export const PublicDocketRecordHeader = connect(
  props,
  function ({
    docketNumber,
    gotoPublicPrintableDocketRecordSequence,
    PUBLIC_DOCKET_RECORD_FILTER_OPTIONS,
    publicCaseDetailHelper,
    showModal,
  }: typeof props) {
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
                {Object.entries(PUBLIC_DOCKET_RECORD_FILTER_OPTIONS).map(
                  ([key, value]) => (
                    <option key={`filter-${key}`} value={value}>
                      {value}
                    </option>
                  ),
                )}
              </BindedSelect>
            </div>
            <div className="tablet:grid-col-8">
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

PublicDocketRecordHeader.displayName = 'PublicDocketRecordHeader';
