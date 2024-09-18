import { BigHeader } from '@web-client/views/BigHeader';
import { FilePetitionStep1 } from '@web-client/views/StartCaseUpdated/FilePetitionStep1';
import { FilePetitionStep2 } from '@web-client/views/StartCaseUpdated/FilePetitionStep2';
import { FilePetitionStep3 } from '@web-client/views/StartCaseUpdated/FilePetitionStep3';
import { FilePetitionStep4 } from '@web-client/views/StartCaseUpdated/FilePetitionStep4';
import { FilePetitionStep5 } from '@web-client/views/StartCaseUpdated/FilePetitionStep5';
import { FilePetitionStep6 } from '@web-client/views/StartCaseUpdated/FilePetitionStep6';
import { FilePetitionStep7 } from '@web-client/views/StartCaseUpdated/FilePetitionStep7';
import { FormCancelModalDialog } from '@web-client/views/FormCancelModalDialog';
import { PetitionSuccessHeader } from '@web-client/views/PetitionSuccessHeader';
import { StepIndicator } from '@web-client/views/StepIndicator';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const FilePetition = connect(
  {
    closeModalAndReturnToDashboardSequence:
      sequences.closeModalAndReturnToDashboardSequence,
    showModal: state.modal.showModal,
    stepIndicatorInfo: state.stepIndicatorInfo,
  },
  function FilePetition({
    closeModalAndReturnToDashboardSequence,
    showModal,
    stepIndicatorInfo,
  }) {
    const { currentStep } = stepIndicatorInfo;
    return (
      <>
        {currentStep === 7 ? (
          <PetitionSuccessHeader />
        ) : (
          <BigHeader text="Create a Case" />
        )}
        <section className="usa-section grid-container">
          <StepIndicator />
          {currentStep === 1 && <FilePetitionStep1 />}
          {currentStep === 2 && <FilePetitionStep2 />}
          {currentStep === 3 && <FilePetitionStep3 />}
          {currentStep === 4 && <FilePetitionStep4 />}
          {currentStep === 5 && <FilePetitionStep5 />}
          {currentStep === 6 && <FilePetitionStep6 />}
          {currentStep === 7 && <FilePetitionStep7 />}
        </section>
        {showModal == 'FormCancelModalDialog' && (
          <FormCancelModalDialog
            onCancelSequence={closeModalAndReturnToDashboardSequence}
          />
        )}
      </>
    );
  },
);
FilePetition.displayName = 'FilePetition';
