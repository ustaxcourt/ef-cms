import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import { state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

const PetitionDetails = ({ caseDetail, showPaymentRecord }) => (
  <React.Fragment>
    <div className="grid-row">
      <div className="grid-col-6">
        <p className="label">Notice/case type</p>
        <p>{caseDetail.caseType}</p>
      </div>
      <div className="grid-col-6">
        <p className="label">Case procedure</p>
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
        <p className="label">Place of trial</p>
        <p>{caseDetail.formattedTrialCity}</p>
      </div>
      <div className="grid-col-6">
        <p className="label">Trial date</p>
        <p>{caseDetail.formattedTrialDate}</p>
      </div>
    </div>
    <div className="grid-row">
      <div className="grid-col-6">
        <p className="label">Assigned judge</p>
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
    caseDetailHelper: state.caseDetailHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    openBlockFromTrialModalSequence: sequences.openBlockFromTrialModalSequence,
    openUnblockFromTrialModalSequence:
      sequences.openUnblockFromTrialModalSequence,
  },
  ({
    caseDetailHelper,
    formattedCaseDetail,
    openBlockFromTrialModalSequence,
    openUnblockFromTrialModalSequence,
  }) => {
    return (
      <div
        className={classNames(
          'internal-information',
          formattedCaseDetail.showUnblockHint && 'less',
        )}
      >
        {formattedCaseDetail.showUnblockHint && (
          <span className="alert-error margin-bottom-2">
            <FontAwesomeIcon
              className="text-secondary-vivid"
              icon={['fas', 'hand-paper']}
              size="lg"
            />
            <span className="margin-left-1 text-bold">Blocked from Trial:</span>{' '}
            <span className="margin-right-5">
              {formattedCaseDetail.blockedReason}
            </span>
            <Button
              link
              className="red-warning"
              icon="trash"
              onClick={() => {
                openUnblockFromTrialModalSequence();
              }}
            >
              Remove Block
            </Button>
          </span>
        )}

        <div className="grid-container padding-x-0">
          <div className="grid-row grid-gap">
            <div className="tablet:grid-col-6">
              <div className="card height-full">
                <div className="content-wrapper">
                  <h3 className="underlined">Petition Details</h3>
                  <PetitionDetails
                    caseDetail={formattedCaseDetail}
                    showPaymentRecord={caseDetailHelper.showPaymentRecord}
                  />
                </div>
              </div>
            </div>
            <div className="tablet:grid-col-6">
              <div className="card height-full">
                <div className="content-wrapper">
                  {formattedCaseDetail.showBlockFromTrialButton && (
                    <Button
                      link
                      className="block-from-trial-btn red-warning float-right"
                      icon="hand-paper"
                      onClick={() => {
                        openBlockFromTrialModalSequence();
                      }}
                    >
                      Block From Trial
                    </Button>
                  )}
                  <h3 className="underlined">Trial Information</h3>
                  <TrialInformation caseDetail={formattedCaseDetail} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
