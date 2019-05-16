import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const CaseInformationInternal = connect(
  {
    caseDetail: state.formattedCaseDetail,
    helper: state.caseDetailHelper,
  },
  ({ helper, caseDetail }) => {
    return (
      <div className="subsection internal-information">
        <div className="grid-container padding-x-0">
          <div className="grid-row grid-gap">
            <div className="grid-col-6">
              <div className="card height-full">
                <div className="content-wrapper">
                  <h3 className="underlined">Petition Details</h3>
                  <div className="grid-container padding-x-0">
                    <div className="grid-row">
                      <div className="grid-col-4">
                        <p className="label">Notice/Case Type</p>
                        <p>{caseDetail.caseType}</p>
                        <p className="label">IRS Notice Date</p>
                        <p id="irs-notice-date">
                          {caseDetail.irsNoticeDateFormatted}
                        </p>
                      </div>
                      <div className="grid-col-4">
                        <p className="label">Case Procedure</p>
                        <p>{caseDetail.procedureType}</p>
                      </div>
                      <div className="grid-col-4">
                        {helper.showPaymentRecord && (
                          <React.Fragment>
                            <p className="label">Petition Fee Paid</p>
                            <p id="pay-gov-id-display">{caseDetail.payGovId}</p>
                          </React.Fragment>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid-col-6">
              <div className="card height-full">
                <div className="content-wrapper">
                  <h3 className="underlined">Trial Information</h3>
                  <div className="grid-col-4">
                    <p className="label">Place of Trial</p>
                    <p>{caseDetail.preferredTrialCity}</p>
                    <p className="label">Assigned Judge</p>
                    <p>Not assigned</p>
                  </div>
                  <div className="grid-col-4">
                    <p className="label">Trial Date</p>
                    <p>Not scheduled</p>
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
