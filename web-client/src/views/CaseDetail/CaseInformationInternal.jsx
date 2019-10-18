import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import { state } from 'cerebral';
import PropTypes from 'prop-types';
import React from 'react';

const PetitionDetails = ({ caseDetail, showPaymentRecord }) => (
  <React.Fragment>
    <div className="grid-row">
      <div className="grid-col-4">
        <p className="label">Notice/Case Type</p>
        <p>{caseDetail.caseType}</p>
      </div>
      <div className="grid-col-4">
        <p className="label">Case Procedure</p>
        <p>{caseDetail.procedureType}</p>
      </div>
      <div className="grid-col-4">
        <p className="label">Requested Place of Trial</p>
        <p>{caseDetail.formattedPreferredTrialCity}</p>
      </div>
    </div>
    <div className="grid-row">
      <div className="grid-col-4">
        <p className="label">IRS Notice Date</p>
        <p className="irs-notice-date">{caseDetail.irsNoticeDateFormatted}</p>
      </div>
      <div className="grid-col-4">
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

const TrialInformation = ({
  caseDetail,
  openAddToTrialModalSequence,
  openBlockFromTrialModalSequence,
  openRemoveFromTrialSessionModalSequence,
  openUnblockFromTrialModalSequence,
}) => (
  <React.Fragment>
    {caseDetail.showTrialCalendared && (
      <>
        <h3 className="underlined">
          Trial - Calendared
          <FontAwesomeIcon
            className="margin-left-1 mini-success"
            icon="check-circle"
            size="1x"
          />
        </h3>
        <div className="grid-row">
          <div className="grid-col-4">
            <p className="label">Place of Trial</p>
            <p>{caseDetail.formattedTrialCity}</p>
          </div>
          <div className="grid-col-4">
            <p className="label">Trial Date</p>
            <p>{caseDetail.formattedTrialDate}</p>
          </div>
          <div className="grid-col-4">
            <p className="label">Assigned Judge</p>
            <p>{caseDetail.formattedTrialJudge}</p>
          </div>
        </div>
        <Button
          link
          className="red-warning"
          icon="trash"
          id="remove-from-trial-session-btn"
          onClick={() => {
            openRemoveFromTrialSessionModalSequence();
          }}
        >
          Remove from Trial Session
        </Button>
      </>
    )}
    {caseDetail.showBlockedFromTrial && (
      <>
        <h3 className="underlined">
          Trial - Blocked From Trial
          <FontAwesomeIcon
            className="text-secondary-dark margin-left-1"
            icon={['fas', 'hand-paper']}
            size="1x"
          />
        </h3>
        <div className="grid-row">
          <p className="label">
            Blocked from Trial {caseDetail.blockedDateFormatted}:{' '}
            <span className="text-normal">{caseDetail.blockedReason}</span>
          </p>
        </div>
        <Button
          link
          className="red-warning margin-top-2"
          icon="trash"
          onClick={() => {
            openUnblockFromTrialModalSequence();
          }}
        >
          Remove Block
        </Button>
      </>
    )}
    {caseDetail.showNotScheduled && (
      <>
        <h3 className="underlined">Trial - Not Scheduled</h3>
        <div className="display-flex flex-row flex-justify">
          <Button
            link
            icon="plus-circle"
            id="add-to-trial-session-btn"
            onClick={() => {
              openAddToTrialModalSequence();
            }}
          >
            Add to Trial
          </Button>
          <Button
            link
            className="block-from-trial-btn red-warning"
            icon="hand-paper"
            onClick={() => {
              openBlockFromTrialModalSequence();
            }}
          >
            Block From Trial
          </Button>
        </div>
      </>
    )}
  </React.Fragment>
);

TrialInformation.propTypes = {
  caseDetail: PropTypes.object,
  openAddToTrialModalSequence: PropTypes.func,
  openBlockFromTrialModalSequence: PropTypes.func,
  openRemoveFromTrialSessionModalSequence: PropTypes.func,
  openUnblockFromTrialModalSequence: PropTypes.func,
};

export const CaseInformationInternal = connect(
  {
    caseDetailHelper: state.caseDetailHelper,
    formattedCaseDetail: state.formattedCaseDetail,
    openAddToTrialModalSequence: sequences.openAddToTrialModalSequence,
    openBlockFromTrialModalSequence: sequences.openBlockFromTrialModalSequence,
    openRemoveFromTrialSessionModalSequence:
      sequences.openRemoveFromTrialSessionModalSequence,
    openUnblockFromTrialModalSequence:
      sequences.openUnblockFromTrialModalSequence,
  },
  ({
    caseDetailHelper,
    formattedCaseDetail,
    openAddToTrialModalSequence,
    openBlockFromTrialModalSequence,
    openRemoveFromTrialSessionModalSequence,
    openUnblockFromTrialModalSequence,
  }) => {
    return (
      <div className="internal-information">
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
                  <TrialInformation
                    caseDetail={formattedCaseDetail}
                    openAddToTrialModalSequence={openAddToTrialModalSequence}
                    openBlockFromTrialModalSequence={
                      openBlockFromTrialModalSequence
                    }
                    openRemoveFromTrialSessionModalSequence={
                      openRemoveFromTrialSessionModalSequence
                    }
                    openUnblockFromTrialModalSequence={
                      openUnblockFromTrialModalSequence
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);
