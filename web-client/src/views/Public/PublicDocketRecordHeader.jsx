import { Button } from '../../ustc-ui/Button/Button';
import { connect } from '@cerebral/react';
import React from 'react';

export const PublicDocketRecordHeader = connect({}, () => {
  return (
    <React.Fragment>
      <div className="title">
        <h1>Docket Record</h1>
        <Button
          link
          aria-label="printable docket record"
          className="hide-on-mobile float-right margin-right-0 margin-top-1"
          icon="print"
          onClick={() => {}}
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
              icon="print"
              onClick={() => {}}
            >
              Printable Docket Record
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
});
