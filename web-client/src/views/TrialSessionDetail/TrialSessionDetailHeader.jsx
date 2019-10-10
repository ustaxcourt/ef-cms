import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const TrialSessionDetailHeader = connect(
  {
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
    trialSessionHeaderHelper: state.trialSessionHeaderHelper,
  },
  ({ formattedTrialSessionDetails, trialSessionHeaderHelper }) => (
    <>
      <div className="big-blue-header">
        <div className="grid-container">
          <div className="margin-bottom-1">
            <h1 tabIndex="-1">{formattedTrialSessionDetails.trialLocation}</h1>
            <span
              className={`usa-tag ${
                !formattedTrialSessionDetails.isCalendared
                  ? 'ustc-tag--yellow'
                  : ''
              }`}
            >
              <span aria-hidden="true">
                {formattedTrialSessionDetails.formattedTerm}:{' '}
                {formattedTrialSessionDetails.status}
              </span>
            </span>
            <span className="margin-left-205">
              {trialSessionHeaderHelper.showSwitchToWorkingCopy && (
                <a
                  className="button-switch-box"
                  href={`/trial-session-working-copy/${formattedTrialSessionDetails.trialSessionId}`}
                >
                  <FontAwesomeIcon icon={['far', 'clone']} />
                  Switch to Working Copy
                </a>
              )}
              {trialSessionHeaderHelper.showSwitchToSessionDetail && (
                <a
                  className="button-switch-box"
                  href={`/trial-session-detail/${formattedTrialSessionDetails.trialSessionId}`}
                >
                  <FontAwesomeIcon icon={['far', 'clone']} />
                  Switch to Session Detail
                </a>
              )}
            </span>
          </div>
          <p className="margin-y-0" id="case-title">
            <span>{formattedTrialSessionDetails.formattedStartDate}</span>
          </p>
        </div>
      </div>
    </>
  ),
);
