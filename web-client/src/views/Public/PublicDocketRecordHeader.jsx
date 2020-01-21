import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const PublicDocketRecordHeader = connect(
  { docketNumber: state.caseDetail.docketNumber },
  ({ docketNumber }) => {
    return (
      <React.Fragment>
        <div className="title">
          <h1>Docket Record</h1>
          <Button
            link
            className="hide-on-mobile float-right margin-right-0 margin-top-1"
            href={`/case-detail/${docketNumber}/printable-docket-record`}
            icon="print"
          >
            Printable Docket Record
          </Button>
        </div>
        <div className="grid-container padding-0 docket-record-header">
          <div className="grid-row margin-bottom-2">
            <div className="tablet:grid-col-10">
              <Button
                link
                aria-hidden="true"
                className="show-on-mobile margin-top-1 text-left"
                href={`/case-detail/${docketNumber}/printable-docket-record`}
                icon="print"
              >
                Printable Docket Record
              </Button>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  },
);
