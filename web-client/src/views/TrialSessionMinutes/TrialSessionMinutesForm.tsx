import { ActionsAndFilingsFieldset } from '@web-client/views/TrialSessionMinutes/ActionsAndFilingsFieldset';
import { CaseMetadataFieldset } from '@web-client/views/TrialSessionMinutes/CaseMetadataFieldset';
import { ExhibitsFieldset } from './ExhibitsFieldset';
import { JurisdictionRetainedFieldset } from '@web-client/views/TrialSessionMinutes/JurisdictionRetainedFieldset';
import { MotionsFieldset } from '@web-client/views/TrialSessionMinutes/MotionsFieldset';
import { OrdersFieldset } from '@web-client/views/TrialSessionMinutes/OrdersFieldset';
import { PetitionersFieldset } from '@web-client/views/TrialSessionMinutes/PetitionersFieldset';
import { RespondentsFieldset } from '@web-client/views/TrialSessionMinutes/RespondentsFieldset';
import { TrialBriefFieldset } from './TrialBriefFieldset';
import { TrialSessionMetadataFieldset } from '@web-client/views/TrialSessionMinutes/SessionMetadataFieldset';
import { WitnessesFieldset } from './WitnessesFieldset';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
// http://localhost:1234/trial-session-detail/959c4338-0fac-42eb-b0eb-d53b8d0195cc/case/101-20/minutes

export const TrialSessionMinutesForm = connect(
  {
    addMinuteSheetFormRowSequence: sequences.addMinuteSheetFormRowSequence,
    removeMinuteSheetFormRowSequence:
      sequences.removeMinuteSheetFormRowSequence,
    trialSessionMinutesAutosaveSequence:
      sequences.trialSessionMinutesAutosaveSequence,
    trialSessionMinutesForm: state.minuteSheetForm,
    updateTrialSessionMinutesFormSequence:
      sequences.updateTrialSessionMinutesFormSequence,
  },
  ({
    addMinuteSheetFormRowSequence,
    removeMinuteSheetFormRowSequence,
    trialSessionMinutesAutosaveSequence,
    trialSessionMinutesForm,
    updateTrialSessionMinutesFormSequence,
  }) => {
    return (
      <form>
        <TrialSessionMetadataFieldset
          trialSessionMetadataFormState={
            trialSessionMinutesForm.trialSessionMetadata
          }
          onBlurHandler={trialSessionMinutesAutosaveSequence}
          onChangeHandler={updateTrialSessionMinutesFormSequence}
        />
        <hr />
        <CaseMetadataFieldset
          addRowHandler={addMinuteSheetFormRowSequence}
          caseMetadataFormState={trialSessionMinutesForm.caseMetadata}
          onBlurHandler={trialSessionMinutesAutosaveSequence}
          onChangeHandler={updateTrialSessionMinutesFormSequence}
        />
        <hr />
        <div className="grid-row">
          <div className="grid-col-6 border-right">
            <PetitionersFieldset
              addRowHandler={addMinuteSheetFormRowSequence}
              petitionersFormState={trialSessionMinutesForm.petitioners}
              removeRowHandler={removeMinuteSheetFormRowSequence}
              onBlurHandler={trialSessionMinutesAutosaveSequence}
              onChangeHandler={updateTrialSessionMinutesFormSequence}
            />
          </div>
          <div className="grid-col-6">
            <RespondentsFieldset
              addRowHandler={addMinuteSheetFormRowSequence}
              removeRowHandler={removeMinuteSheetFormRowSequence}
              respondentsFormState={trialSessionMinutesForm.respondents}
              onBlurHandler={trialSessionMinutesAutosaveSequence}
              onChangeHandler={updateTrialSessionMinutesFormSequence}
            />
          </div>
        </div>
        <hr />
        <JurisdictionRetainedFieldset
          jurisdictionRetainedFormState={
            trialSessionMinutesForm.jurisdictionRetained
          }
          onBlurHandler={trialSessionMinutesAutosaveSequence}
          onChangeHandler={updateTrialSessionMinutesFormSequence}
        />
        <hr />
        <OrdersFieldset
          ordersFormState={trialSessionMinutesForm.orders}
          onBlurHandler={trialSessionMinutesAutosaveSequence}
          onChangeHandler={updateTrialSessionMinutesFormSequence}
        />
        <hr />
        <MotionsFieldset
          addRowHandler={addMinuteSheetFormRowSequence}
          motionsFormState={trialSessionMinutesForm.motionsSection}
          onBlurHandler={trialSessionMinutesAutosaveSequence}
          onChangeHandler={updateTrialSessionMinutesFormSequence}
        />
        <hr />
        <ActionsAndFilingsFieldset
          actionsAndFilingsFormState={
            trialSessionMinutesForm.actionsAndFilingsSection
          }
          addRowHandler={addMinuteSheetFormRowSequence}
          removeRowHandler={removeMinuteSheetFormRowSequence}
          onBlurHandler={trialSessionMinutesAutosaveSequence}
          onChangeHandler={updateTrialSessionMinutesFormSequence}
        />
        <hr />
        <TrialBriefFieldset
          trialBriefFormState={trialSessionMinutesForm.trialBrief}
          onBlurHandler={trialSessionMinutesAutosaveSequence}
          onChangeHandler={updateTrialSessionMinutesFormSequence}
        />
        <hr />
        <div className="grid-row">
          <div className="grid-col-6 border-right">
            <WitnessesFieldset
              addRowHandler={addMinuteSheetFormRowSequence}
              removeRowHandler={removeMinuteSheetFormRowSequence}
              witnessType="petitioner"
              witnessesFormState={
                trialSessionMinutesForm.witnesses.petitionerWitnesses
              }
              onBlurHandler={trialSessionMinutesAutosaveSequence}
              onChangeHandler={updateTrialSessionMinutesFormSequence}
            />
          </div>
          <div className="grid-col-6 padding-left-4">
            <WitnessesFieldset
              addRowHandler={addMinuteSheetFormRowSequence}
              removeRowHandler={removeMinuteSheetFormRowSequence}
              witnessType="respondent"
              witnessesFormState={
                trialSessionMinutesForm.witnesses.respondentWitnesses
              }
              onBlurHandler={trialSessionMinutesAutosaveSequence}
              onChangeHandler={updateTrialSessionMinutesFormSequence}
            />
          </div>
        </div>
        <hr />
        <div>
          <ExhibitsFieldset
            addRowHandler={addMinuteSheetFormRowSequence}
            exhibitsFormState={trialSessionMinutesForm.exhibits}
            removeRowHandler={removeMinuteSheetFormRowSequence}
            onBlurHandler={trialSessionMinutesAutosaveSequence}
            onChangeHandler={updateTrialSessionMinutesFormSequence}
          />
        </div>
      </form>
    );
  },
);
