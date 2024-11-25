import { CaseDetailHeader } from '@web-client/views/CaseDetail/CaseDetailHeader';
import { TrialSessionMinutesForm } from '@web-client/views/TrialSessionMinutes/TrialSessionMinutesForm';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const TrialSessionMinutesPage = connect(
  {
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
  },
  ({ formattedTrialSessionDetails }) => {
    return (
      <>
        <CaseDetailHeader hideActionButtons />
        <div className="margin-left-4 margin-right-4">
          <h1>
            Minutes: {formattedTrialSessionDetails.trialLocation} -{' '}
            {formattedTrialSessionDetails.formattedStartDate}
          </h1>
          <TrialSessionMinutesForm />
        </div>
      </>
    );
  },
);

TrialSessionMinutesPage.displayName = 'TrialSessionMinutesPage';
