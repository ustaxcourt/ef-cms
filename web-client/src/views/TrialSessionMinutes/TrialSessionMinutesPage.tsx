import { Button } from '@web-client/ustc-ui/Button/Button';
import { CaseDetailHeader } from '@web-client/views/CaseDetail/CaseDetailHeader';
import { TrialSessionMinutesForm } from '@web-client/views/TrialSessionMinutes/TrialSessionMinutesForm';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { SuccessNotification } from '../SuccessNotification';
import { ErrorNotification } from '../ErrorNotification';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const TrialSessionMinutesPage = connect(
  {
    downloadMinuteSheetFormPdfSequence:
      sequences.downloadMinuteSheetFormPdfSequence,
    saveMinuteSheetToDraftsSequence: sequences.saveMinuteSheetToDraftsSequence,
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
  },
  ({
    downloadMinuteSheetFormPdfSequence,
    saveMinuteSheetToDraftsSequence,
    formattedTrialSessionDetails,
  }: {
    downloadMinuteSheetFormPdfSequence: (props: {
      forceAutosave?: boolean;
    }) => void;
    saveMinuteSheetToDraftsSequence: (props: {
      forceAutosave?: boolean;
    }) => void;
    formattedTrialSessionDetails: any;
  }) => {
    return (
      <>
        <CaseDetailHeader hideActionButtons openCaseInNewTab />
        <div
          className="grid-container"
          data-testid="trial-session-minutes-page"
        >
          <Button
            data-testid="back-to-trial-session-btn"
            link
            href={`/trial-session-detail/${formattedTrialSessionDetails.trialSessionId}`}
          >
            <FontAwesomeIcon icon={['fas', 'arrow-alt-circle-left']} />
            Back to Session Information
          </Button>
          <SuccessNotification
            className="usa-alert--success-max-width-none"
            isDismissible={false}
          />
          <ErrorNotification />
          <div className="grid-row">
            <h1 className="grid-col-fill">
              Minutes: {formattedTrialSessionDetails.trialLocation} -{' '}
              {formattedTrialSessionDetails.formattedStartDate}
            </h1>
            <div className="grid-col-auto">
              <Button
                data-testid="save-to-drafts-button-top"
                onClick={e => {
                  e.preventDefault();
                  saveMinuteSheetToDraftsSequence({ forceAutosave: true });
                }}
              >
                Save to Drafts
              </Button>
              <Button
                secondary
                data-testid="preview-pdf-button-top"
                onClick={e => {
                  e.preventDefault();
                  downloadMinuteSheetFormPdfSequence({ forceAutosave: true });
                }}
              >
                Preview PDF
              </Button>
            </div>
          </div>
          <TrialSessionMinutesForm />
          <Button
            data-testid="save-to-drafts-button-bot"
            onClick={e => {
              e.preventDefault();
              saveMinuteSheetToDraftsSequence({ forceAutosave: true });
            }}
          >
            Save to Drafts
          </Button>
          <Button
            secondary
            data-testid="preview-pdf-button-bot"
            onClick={e => {
              e.preventDefault();
              downloadMinuteSheetFormPdfSequence({ forceAutosave: true });
            }}
          >
            Preview PDF
          </Button>
        </div>
      </>
    );
  },
);
