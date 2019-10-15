import { Mobile, NonMobile } from '../../ustc-ui/Responsive/Responsive';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

const TrialInformation = ({ caseDetail }) => (
  <React.Fragment>
    <div className="grid-row">
      <div className="tablet:grid-col-6">
        <p className="label">Place of trial</p>
        <p>{caseDetail.formattedTrialCity}</p>
      </div>
      <div className="tablet:grid-col-6">
        <p className="label">Trial date</p>
        <p>{caseDetail.formattedTrialDate}</p>
      </div>
    </div>
    <div className="grid-row">
      <div className="tablet:grid-col-6">
        <p className="label">Assigned judge</p>
        <p>{caseDetail.formattedTrialJudge}</p>
      </div>
    </div>
  </React.Fragment>
);

TrialInformation.propTypes = {
  caseDetail: PropTypes.object,
};

export const CaseInformationPublic = connect(
  {
    formattedCaseDetail: state.formattedCaseDetail,
  },
  ({ formattedCaseDetail }) => {
    return (
      <div className="petitions-details">
        <div className="grid-container padding-x-0">
          <NonMobile>
            <div className="card height-full">
              <div className="content-wrapper">
                <h3 className="underlined">Trial Information</h3>
                <TrialInformation caseDetail={formattedCaseDetail} />
              </div>
            </div>
          </NonMobile>
          <Mobile>
            <div className="margin-top-2">
              <div className="case-info-card">
                <h3>Trial Information</h3>
                <TrialInformation caseDetail={formattedCaseDetail} />
              </div>
            </div>
          </Mobile>
        </div>
      </div>
    );
  },
);
