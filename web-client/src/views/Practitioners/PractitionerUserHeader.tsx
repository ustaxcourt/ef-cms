import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const PractitionerUserHeader = connect(
  {
    practitionerDetailHelper: state.practitionerDetailHelper,
  },
  function PractitionerUserHeader({ practitionerDetailHelper }) {
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <div className="grid-row">
              <div className="tablet:grid-col-12">
                <h1 className="captioned" tabIndex={-1}>
                  {practitionerDetailHelper.name}
                </h1>
                <span className="usa-tag">
                  {practitionerDetailHelper.admissionsStatus}
                </span>
              </div>
            </div>
            <div className="grid-row">
              <div className="tablet:grid-col-12">
                {practitionerDetailHelper.barNumber}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  },
);

PractitionerUserHeader.displayName = 'PractitionerUserHeader';
