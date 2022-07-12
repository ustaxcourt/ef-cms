import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const TrialSessionDetailHeader = connect(
  {
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
  },
  function TrialSessionDetailHeader({ formattedTrialSessionDetails }) {
    return (
      <>
        <div className="big-blue-header">
          <div className="grid-container">
            <div className="margin-bottom-1">
              <h1 tabIndex="-1">
                {formattedTrialSessionDetails.trialLocation}
              </h1>
              <span className="usa-tag">
                <span aria-hidden="true">
                  {formattedTrialSessionDetails.formattedTerm}:{' '}
                  {formattedTrialSessionDetails.computedStatus}
                </span>
              </span>
            </div>
            <p className="margin-y-0" id="case-title">
              <span>
                {formattedTrialSessionDetails.formattedStartDate}
                {formattedTrialSessionDetails.formattedEstimatedEndDate &&
                  ` - ${formattedTrialSessionDetails.formattedEstimatedEndDate}`}
              </span>
            </p>
          </div>
        </div>
      </>
    );
  },
);
