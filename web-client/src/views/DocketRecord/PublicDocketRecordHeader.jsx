import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import React from 'react';

export const PublicDocketRecordHeader = connect({}, () => {
  return (
    <React.Fragment>
      <div className="grid-container padding-0 docket-record-header">
        <div className="grid-row">
          <div className="tablet:grid-col-10">
            <Button
              link
              aria-hidden="true"
              className="show-on-mobile margin-top-1 margin-left-2"
              onClick={() => {}}
            >
              <FontAwesomeIcon icon="print" size="sm" />
              Printable Docket Record
            </Button>
            <Button
              link
              aria-label="printable docket record"
              className="hide-on-mobile margin-top-1 margin-left-2"
              onClick={() => {}}
            >
              <FontAwesomeIcon icon="print" size="sm" />
              Printable Docket Record
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
});
