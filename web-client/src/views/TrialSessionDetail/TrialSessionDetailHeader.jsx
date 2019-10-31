import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const TrialSessionDetailHeader = connect(
  {
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
  },
  ({ formattedTrialSessionDetails }) => (
    <>
      <div className="big-blue-header">
        <div className="grid-container">
          <div className="margin-bottom-1">
            <h1 tabIndex="-1">{formattedTrialSessionDetails.trialLocation}</h1>
            <span
              className={classNames(
                'usa-tag',
                !formattedTrialSessionDetails.isCalendared &&
                  'ustc-tag--yellow',
              )}
            >
              <span aria-hidden="true">
                {formattedTrialSessionDetails.formattedTerm}:{' '}
                {formattedTrialSessionDetails.status}
              </span>
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
