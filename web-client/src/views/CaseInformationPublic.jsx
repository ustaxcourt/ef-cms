import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseInformationPublic = connect(
  {
    caseDetail: state.formattedCaseDetail,
    helper: state.caseDetailHelper,
  },
  ({ helper, caseDetail }) => {
    return (
      <div className="petitions-details">
        <div className="usa-grid-full">
          <div className="usa-width-one-half">
            <h3 className="underlined">Petition Details</h3>
            <div className="usa-grid-full">
              {helper.showPaymentRecord && (
                <React.Fragment>
                  <p className="label">Petition Fee Paid</p>
                  <p>
                    Paid by pay.gov
                    <br />
                    {caseDetail.payGovDateFormatted}
                  </p>
                </React.Fragment>
              )}
            </div>
          </div>
          <div className="usa-width-one-half">
            <h3 className="underlined">Trial Information</h3>
            <div className="usa-width-one-third">
              <p className="label">Place of Trial</p>
              <p>{caseDetail.preferredTrialCity}</p>
            </div>
            <div className="usa-width-one-third">
              <p className="label">Assigned Judge</p>
              <p>Not assigned</p>
            </div>
            <div className="usa-width-one-third">
              <p className="label">Trial Date</p>
              <p>Not scheduled</p>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
