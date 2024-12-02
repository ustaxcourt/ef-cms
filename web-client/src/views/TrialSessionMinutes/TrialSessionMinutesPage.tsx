import { CaseDetailHeader } from '@web-client/views/CaseDetail/CaseDetailHeader';
import { TrialSessionMinutesForm } from '@web-client/views/TrialSessionMinutes/TrialSessionMinutesForm';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const TrialSessionMinutesPage = connect(
  {
    formattedTrialSessionDetails: state.formattedTrialSessionDetails,
    trialSessionMinutesOnChangeSequence:
      sequences.trialSessionMinutesOnChangeSequence,
    trialSessionMinutesAutosaveSequence:
      sequences.trialSessionMinutesAutosaveSequence,
    trialSessionMinutesForm: state.minuteSheetForm,
  },
  ({
    formattedTrialSessionDetails,
    trialSessionMinutesAutosaveSequence,
    trialSessionMinutesForm,
    trialSessionMinutesOnChangeSequence,
  }) => {
    return (
      <>
        <CaseDetailHeader hideActionButtons />
        <div className="grid-container padding-2">
          <h1>
            Minutes: {formattedTrialSessionDetails.trialLocation} -{' '}
            {formattedTrialSessionDetails.formattedStartDate}
          </h1>
          <TrialSessionMinutesForm
            autosaveHandler={trialSessionMinutesAutosaveSequence}
            trialSessionMinutesFormState={trialSessionMinutesForm}
            onChangeHandler={trialSessionMinutesOnChangeSequence}
          />
        </div>
      </>
    );
  },
);

TrialSessionMinutesPage.displayName = 'TrialSessionMinutesPage';
