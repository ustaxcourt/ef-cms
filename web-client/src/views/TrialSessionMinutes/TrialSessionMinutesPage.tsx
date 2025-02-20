import { Button } from '@web-client/ustc-ui/Button/Button';
import { CaseDetailHeader } from '@web-client/views/CaseDetail/CaseDetailHeader';
import { TrialSessionMinutesForm } from '@web-client/views/TrialSessionMinutes/TrialSessionMinutesForm';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const TrialSessionMinutesPage = connect(
  {
    downloadMinuteSheetFormPdfSequence:
      sequences.downloadMinuteSheetFormPdfSequence,

    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
  },
  ({ downloadMinuteSheetFormPdfSequence, formattedTrialSessionDetails }) => {
    return (
      <>
        <CaseDetailHeader hideActionButtons openCaseInNewTab />
        <div
          className="grid-container"
          data-testid="trial-session-minutes-page"
        >
          <div className="grid-row">
            <h1 className="grid-col-fill">
              Minutes: {formattedTrialSessionDetails.trialLocation} -{' '}
              {formattedTrialSessionDetails.formattedStartDate}
            </h1>
            <div className="grid-col-auto">
              <Button
                data-testid="download-pdf-button"
                onClick={e => {
                  e.preventDefault();
                  downloadMinuteSheetFormPdfSequence();
                }}
              >
                Download PDF
              </Button>
            </div>
          </div>
          <TrialSessionMinutesForm />
          <Button
            className="margin-top-2"
            onClick={e => {
              e.preventDefault();
              downloadMinuteSheetFormPdfSequence();
            }}
          >
            Download PDF
          </Button>
        </div>
      </>
    );
  },
);

TrialSessionMinutesPage.displayName = 'TrialSessionMinutesPage';
