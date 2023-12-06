import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
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
              <h1 tabIndex={-1}>
                {formattedTrialSessionDetails.trialLocation}
              </h1>
              <span className="usa-tag">
                <span aria-hidden="true">
                  {formattedTrialSessionDetails.formattedTerm}:{' '}
                  {formattedTrialSessionDetails.sessionStatus}
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

TrialSessionDetailHeader.displayName = 'TrialSessionDetailHeader';
