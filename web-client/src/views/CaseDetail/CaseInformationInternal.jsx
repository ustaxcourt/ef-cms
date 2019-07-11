import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

const PetitionDetails = ({ caseDetail, showPaymentRecord }) => (
  <React.Fragment>
    <div className="grid-row">
      <div className="grid-col-6">
        <p className="label">Notice/Case Type</p>
        <p>{caseDetail.caseType}</p>
      </div>
      <div className="grid-col-6">
        <p className="label">Case Procedure</p>
        <p>{caseDetail.procedureType}</p>
      </div>
    </div>
    <div className="grid-row">
      <div className="grid-col-6">
        <p className="label">IRS Notice Date</p>
        <p className="irs-notice-date">{caseDetail.irsNoticeDateFormatted}</p>
      </div>
      <div className="grid-col-6">
        {showPaymentRecord && (
          <React.Fragment>
            <p className="label">Petition Fee Paid</p>
            <p className="pay-gov-id-display">{caseDetail.payGovId}</p>
          </React.Fragment>
        )}
      </div>
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
      <div className="grid-col-6">
        <p className="label">Place of Trial</p>
        <p>{caseDetail.formattedTrialCity}</p>
      </div>
      <div className="grid-col-6">
        <p className="label">Trial Date</p>
        <p>{caseDetail.formattedTrialDate}</p>
      </div>
    </div>
    <div className="grid-row">
      <div className="grid-col-6">
        <p className="label">Assigned Judge</p>
        <p>{caseDetail.formattedTrialJudge}</p>
      </div>
    </div>
  </React.Fragment>
);

TrialInformation.propTypes = {
  caseDetail: PropTypes.object,
};

export const CaseInformationInternal = connect(
  {
    caseDetail: state.formattedCaseDetail,
    helper: state.caseDetailHelper,
  },
  ({ caseDetail, helper }) => {
    return (
      <div className="internal-information">
        <div className="grid-container padding-x-0">
          <div className="grid-row grid-gap">
            <NonMobile>
              <div className="tablet:grid-col-6">
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
            </NonMobile>
            <Mobile>
              <div className="tablet:grid-col-6">
                <div className="case-info-card">
                  <h3>Petition Details</h3>
                  <PetitionDetails
                    caseDetail={caseDetail}
                    showPaymentRecord={helper.showPaymentRecord}
                  />
                </div>
              </div>
            </Mobile>
            <NonMobile>
              <div className="tablet:grid-col-6">
                <div className="card height-full">
                  <div className="content-wrapper">
                    <h3 className="underlined">Trial Information</h3>
                    <TrialInformation caseDetail={caseDetail} />
                  </div>
                </div>
              </div>
            </NonMobile>
            <Mobile>
              <div className="tablet:grid-col-6 margin-top-2">
                <div className="case-info-card">
                  <h3>Trial Information</h3>
                  <TrialInformation caseDetail={caseDetail} />
                </div>
              </div>
            </Mobile>
          </div>
        </div>
      </div>
    );
  },
);
