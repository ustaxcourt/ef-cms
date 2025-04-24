import { ActionsAndFilingsFieldset } from '@web-client/views/TrialSessionMinutes/ActionsAndFilingsFieldset';
import { CaseMetadataFieldset } from '@web-client/views/TrialSessionMinutes/CaseMetadataFieldset';
import { ExhibitsFieldset } from './ExhibitsFieldset';
import { JurisdictionFieldset } from '@web-client/views/TrialSessionMinutes/JurisdictionFieldset';
import { MotionsFieldset } from '@web-client/views/TrialSessionMinutes/MotionsFieldset';
import { OrdersFieldset } from '@web-client/views/TrialSessionMinutes/OrdersFieldset';
import { PetitionersFieldset } from '@web-client/views/TrialSessionMinutes/PetitionersFieldset';
import { RespondentsFieldset } from '@web-client/views/TrialSessionMinutes/RespondentsFieldset';
import { TrialBriefFieldset } from './TrialBriefFieldset';
import { TrialSessionMetadataFieldset } from '@web-client/views/TrialSessionMinutes/TrialSessionMetadataFieldset';
import { WitnessesFieldset } from './WitnessesFieldset';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const TrialSessionMinutesForm = connect(
  {
    addMinuteSheetFormRowSequence: sequences.addMinuteSheetFormRowSequence,
    removeMinuteSheetFormRowSequence:
      sequences.removeMinuteSheetFormRowSequence,
    autosaveTrialSessionMinuteSheetSequence:
      sequences.autosaveTrialSessionMinuteSheetSequence,
    trialSessionMinutesForm: state.minuteSheetForm,
    trialSessionMinutesFormOptionsHelper:
      state.trialSessionMinutesFormOptionsHelper,
    updateTrialSessionMinutesFormSequence:
      sequences.updateTrialSessionMinutesFormSequence,
    trialSessionMinutesHelper: state.trialSessionMinutesHelper,
  },
  ({
    addMinuteSheetFormRowSequence,
    removeMinuteSheetFormRowSequence,
    autosaveTrialSessionMinuteSheetSequence,
    trialSessionMinutesForm,
    trialSessionMinutesFormOptionsHelper,
    updateTrialSessionMinutesFormSequence,
    trialSessionMinutesHelper,
  }) => {
    return (
      <form>
        <TrialSessionMetadataFieldset
          trialSessionMetadataFormState={
            trialSessionMinutesForm.trialSessionMetadataSection
          }
          formOptions={trialSessionMinutesFormOptionsHelper.judgeOptions}
          onBlurHandler={autosaveTrialSessionMinuteSheetSequence}
          onChangeHandler={updateTrialSessionMinutesFormSequence}
        />
        <hr />
        <CaseMetadataFieldset
          addRowHandler={addMinuteSheetFormRowSequence}
          caseMetadataFormState={trialSessionMinutesForm.caseMetadataSection}
          onBlurHandler={autosaveTrialSessionMinuteSheetSequence}
          onChangeHandler={updateTrialSessionMinutesFormSequence}
        />
        <hr />
        <PetitionersFieldset
          addRowHandler={addMinuteSheetFormRowSequence}
          petitionersFormState={trialSessionMinutesForm.petitionersSection}
          removeRowHandler={removeMinuteSheetFormRowSequence}
          onBlurHandler={autosaveTrialSessionMinuteSheetSequence}
          onChangeHandler={updateTrialSessionMinutesFormSequence}
        />
        <RespondentsFieldset
          addRowHandler={addMinuteSheetFormRowSequence}
          formOptions={
            trialSessionMinutesFormOptionsHelper.filteredIrsPractitionerOptions
          }
          removeRowHandler={removeMinuteSheetFormRowSequence}
          respondentsFormState={trialSessionMinutesForm.respondentsSection}
          onBlurHandler={autosaveTrialSessionMinuteSheetSequence}
          onChangeHandler={updateTrialSessionMinutesFormSequence}
        />
        <hr />
        <JurisdictionFieldset
          jurisdictionFormState={trialSessionMinutesForm.jurisdictionSection}
          onBlurHandler={autosaveTrialSessionMinuteSheetSequence}
          onChangeHandler={updateTrialSessionMinutesFormSequence}
        />
        <hr />
        <OrdersFieldset
          ordersFormState={trialSessionMinutesForm.ordersSection}
          onBlurHandler={autosaveTrialSessionMinuteSheetSequence}
          onChangeHandler={updateTrialSessionMinutesFormSequence}
        />
        <hr />
        <MotionsFieldset
          addRowHandler={addMinuteSheetFormRowSequence}
          motionsFormState={trialSessionMinutesForm.motionsSection}
          onBlurHandler={autosaveTrialSessionMinuteSheetSequence}
          onChangeHandler={updateTrialSessionMinutesFormSequence}
        />
        <hr />
        <ActionsAndFilingsFieldset
          actionsAndFilingsFormState={
            trialSessionMinutesForm.actionsAndFilingsSection
          }
          addRowHandler={addMinuteSheetFormRowSequence}
          removeRowHandler={removeMinuteSheetFormRowSequence}
          onBlurHandler={autosaveTrialSessionMinuteSheetSequence}
          onChangeHandler={updateTrialSessionMinutesFormSequence}
          trialSessionMinutesHelper={trialSessionMinutesHelper}
        />
        <hr />
        <TrialBriefFieldset
          trialBriefFormState={trialSessionMinutesForm.trialBriefSection}
          onBlurHandler={autosaveTrialSessionMinuteSheetSequence}
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
                trialSessionMinutesForm.witnessesSection.petitionerWitnesses
              }
              onBlurHandler={autosaveTrialSessionMinuteSheetSequence}
              onChangeHandler={updateTrialSessionMinutesFormSequence}
            />
          </div>
          <div className="grid-col-6 padding-left-4">
            <WitnessesFieldset
              addRowHandler={addMinuteSheetFormRowSequence}
              removeRowHandler={removeMinuteSheetFormRowSequence}
              witnessType="respondent"
              witnessesFormState={
                trialSessionMinutesForm.witnessesSection.respondentWitnesses
              }
              onBlurHandler={autosaveTrialSessionMinuteSheetSequence}
              onChangeHandler={updateTrialSessionMinutesFormSequence}
            />
          </div>
        </div>
        <hr />
        <div>
          <ExhibitsFieldset
            addRowHandler={addMinuteSheetFormRowSequence}
            exhibitsFormState={trialSessionMinutesForm.exhibitsSection}
            removeRowHandler={removeMinuteSheetFormRowSequence}
            onBlurHandler={autosaveTrialSessionMinuteSheetSequence}
            onChangeHandler={updateTrialSessionMinutesFormSequence}
          />
        </div>
      </form>
    );
  },
);
