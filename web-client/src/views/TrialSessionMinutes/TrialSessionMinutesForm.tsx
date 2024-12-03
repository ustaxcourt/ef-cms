import { CaseMetadataFieldset } from '@web-client/views/TrialSessionMinutes/CaseMetadataFieldset';
import { PetitionersFieldset } from '@web-client/views/TrialSessionMinutes/PetitionersFieldset';
import { RespondentsFieldset } from '@web-client/views/TrialSessionMinutes/RespondentsFieldset';
import { TrialSessionMetadataFieldset } from '@web-client/views/TrialSessionMinutes/SessionMetadataFieldset';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
// http://localhost:1234/trial-session-detail/959c4338-0fac-42eb-b0eb-d53b8d0195cc/case/101-20/minutes

export const TrialSessionMinutesForm = connect(
  {
    addPetitionerRowSequence: sequences.addPetitionerRowSequence,
    addRecalledRowSequence: sequences.addRecalledRowSequence,
    trialSessionMinutesAutosaveSequence:
      sequences.trialSessionMinutesAutosaveSequence,
    trialSessionMinutesForm: state.minuteSheetForm,
    trialSessionMinutesOnChangeSequence:
      sequences.trialSessionMinutesOnChangeSequence,
  },
  ({
    addPetitionerRowSequence,
    addRecalledRowSequence,
    trialSessionMinutesAutosaveSequence,
    trialSessionMinutesForm,
    trialSessionMinutesOnChangeSequence,
  }) => {
    return (
      <form>
        <TrialSessionMetadataFieldset
          trialSessionMetadataFormState={
            trialSessionMinutesForm.trialSessionMetadata
          }
          onBlurHandler={trialSessionMinutesAutosaveSequence}
          onChangeHandler={trialSessionMinutesOnChangeSequence}
        />

        <hr />
        <CaseMetadataFieldset
          addRecalledRowHandler={addRecalledRowSequence}
          caseMetadataFormState={trialSessionMinutesForm.caseMetadata}
          onBlurHandler={trialSessionMinutesAutosaveSequence}
          onChangeHandler={trialSessionMinutesOnChangeSequence}
        />
        <hr />
        <div className="grid-row">
          <div className="grid-col-6 border-right">
            <PetitionersFieldset
              addPetitionerRowHandler={addPetitionerRowSequence}
              petitionersFormState={trialSessionMinutesForm.petitioners}
              onBlurHandler={trialSessionMinutesAutosaveSequence}
              onChangeHandler={trialSessionMinutesOnChangeSequence}
            />
          </div>
          <div className="grid-col-6">
            <RespondentsFieldset
              respondentsFormState={trialSessionMinutesForm.respondents}
              onBlurHandler={trialSessionMinutesAutosaveSequence}
              onChangeHandler={trialSessionMinutesOnChangeSequence}
            />
          </div>
        </div>
        <hr />
        <div>Jurisdiction Retained Section</div>
        <hr />
        <div>Orders Section</div>
        <hr />
        <div>Motions Section</div>
        <hr />
        <div>Actions and Filings Section</div>
        <hr />
        <div>Trial Brief Section</div>
        <hr />
        <div>Witnesses Section</div>
        <hr />
        <div>Exhibits Section</div>
      </form>
    );
  },
);
