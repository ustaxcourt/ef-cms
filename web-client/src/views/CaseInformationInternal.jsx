import React from 'react';

import { connect } from '@cerebral/react';
import { state } from 'cerebral';

export default connect(
  {
    helper: state.caseDetailHelper,
    caseDetail: state.formattedCaseDetail,
  },
  function CaseInformationInternal({ helper, caseDetail }) {
    return (
      <div className="subsection internal-information">
        <div className="usa-grid-full">
          <div className="usa-width-two-thirds">
            <h3 className="underlined">Petition Details</h3>
            <div className="usa-grid-full">
              <div className="usa-width-one-third">
                <p className="label">Notice/Case Type</p>
                <p>Notice of Deficiency</p>
                <p className="label">IRS Notice Date</p>
                <p>12/22/2018</p>
              </div>
              <div className="usa-width-one-third">
                <p className="label">Case Procedure</p>
                <p>Regular Tax case</p>
              </div>
              <div className="usa-width-one-third">
                {helper.showPaymentRecord && (
                  <React.Fragment>
                    <p className="label">Petition Fee Paid</p>
                    <p>{caseDetail.payGovId}</p>
                  </React.Fragment>
                )}{' '}
              </div>
            </div>
          </div>
          <div className="usa-width-one-third">
            <h3 className="underlined">Trial Information</h3>
            <div className="usa-grid-full">
              <div className="usa-width-one-half">
                <p className="label">Place of Trial</p>
                <p>Los Angeles, CA</p>
                <p className="label">Assigned Judge</p>
                <p>Not assigned</p>
              </div>
              <div className="usa-width-one-half">
                <p className="label">Trial Date</p>
                <p>Not scheduled</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
