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
        <div className="grid-container padding-x-0">
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-6">
              <div className="card height-full">
                <div className="content-wrapper">
                  <h3 className="underlined">Petition Details</h3>
                  <div className="grid-container padding-x-0">
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
              </div>
            </div>
            <div className="tablet:grid-col-6">
              <div className="card height-full">
                <div className="content-wrapper">
                  <h3 className="underlined">Trial Information</h3>
                  <div className="grid-row">
                    <div className="tablet:grid-col-4">
                      <p className="label">Place of Trial</p>
                      <p>{caseDetail.preferredTrialCity}</p>
                    </div>
                    <div className="tablet:grid-col-4">
                      <p className="label">Assigned Judge</p>
                      <p>Not assigned</p>
                    </div>
                    <div className="tablet:grid-col-4">
                      <p className="label">Trial Date</p>
                      <p>Not scheduled</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
