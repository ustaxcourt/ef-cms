import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

const PetitionDetails = ({ caseDetail, showPaymentRecord }) => (
  <React.Fragment>
    <div className="grid-container padding-x-0">
      {showPaymentRecord && (
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
  </React.Fragment>
);

PetitionDetails.propTypes = {
  caseDetail: PropTypes.object,
  showPaymentRecord: PropTypes.bool,
};

const TrialInformation = ({ caseDetail }) => (
  <React.Fragment>
    <div className="grid-row">
      <div className="tablet:grid-col-6">
        <p className="label">Place of Trial</p>
        <p>{caseDetail.preferredTrialCity}</p>
      </div>
      <div className="tablet:grid-col-6">
        <p className="label">Trial Date</p>
        <p>Not scheduled</p>
      </div>
    </div>
    <div className="grid-row">
      <div className="tablet:grid-col-6">
        <p className="label">Assigned Judge</p>
        <p>Not assigned</p>
      </div>
    </div>
  </React.Fragment>
);

TrialInformation.propTypes = {
  caseDetail: PropTypes.object,
};

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
            <div className="chunk tablet:grid-col-6 hide-on-mobile">
              <div className="card height-full">
                <div className="content-wrapper">
                  <h3 className="underlined">Petition Details</h3>
                  <PetitionDetails
                    caseDetail={caseDetail}
                    showPaymentRecord={helper.showPaymentRecord}
                  />
                </div>
              </div>
            </div>
            <div className="tablet:grid-col-6 show-on-mobile">
              <div className="case-info-card">
                <h3>Petition Details</h3>
                <PetitionDetails
                  caseDetail={caseDetail}
                  showPaymentRecord={helper.showPaymentRecord}
                />
              </div>
            </div>
            <div className="chunk tablet:grid-col-6 hide-on-mobile">
              <div className="card height-full">
                <div className="content-wrapper">
                  <h3 className="underlined">Trial Information</h3>
                  <TrialInformation caseDetail={caseDetail} />
                </div>
              </div>
            </div>
            <div className="tablet:grid-col-6 show-on-mobile">
              <div className="case-info-card">
                <h3>Trial Information</h3>
                <TrialInformation caseDetail={caseDetail} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
