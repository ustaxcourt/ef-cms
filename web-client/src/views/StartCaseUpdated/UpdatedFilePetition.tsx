import { BigHeader } from '@web-client/views/BigHeader';
import { FilePetitionPetitionInformation } from '@web-client/views/StartCaseUpdated/FilePetitionPetitionInformation';
import { FilePetitionPetitionerInformation } from '@web-client/views/StartCaseUpdated/FilePetitionPetitionerInformation';
import { FormCancelModalDialog } from '@web-client/views/FormCancelModalDialog';
import { PetitionSuccessHeader } from '@web-client/views/PetitionSuccessHeader';
import { StepIndicator } from '@web-client/views/StepIndicator';
import { UpdatedFilePetitionStep3 } from '@web-client/views/StartCaseUpdated/UpdatedFilePetitionStep3';
import { UpdatedFilePetitionStep4 } from '@web-client/views/StartCaseUpdated/UpdatedFilePetitionStep4';
import { UpdatedFilePetitionStep5 } from '@web-client/views/StartCaseUpdated/UpdatedFilePetitionStep5';
import { UpdatedFilePetitionStep6 } from '@web-client/views/StartCaseUpdated/UpdatedFilePetitionStep6';
import { UpdatedFilePetitionStep7 } from '@web-client/views/StartCaseUpdated/UpdatedFilePetitionStep7';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const UpdatedFilePetition = connect(
  {
    showModal: state.modal.showModal,
    stepIndicatorInfo: state.stepIndicatorInfo,
  },
  function UpdatedFilePetition({ showModal, stepIndicatorInfo }) {
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
          {currentStep === 1 && <FilePetitionPetitionerInformation />}
          {currentStep === 2 && <FilePetitionPetitionInformation />}
          {currentStep === 3 && <UpdatedFilePetitionStep3 />}
          {currentStep === 4 && <UpdatedFilePetitionStep4 />}
          {currentStep === 5 && <UpdatedFilePetitionStep5 />}
          {currentStep === 6 && <UpdatedFilePetitionStep6 />}
          {currentStep === 7 && <UpdatedFilePetitionStep7 />}
        </section>
        {showModal == 'FormCancelModalDialog' && (
          <FormCancelModalDialog
            useRunConfirmSequence={true}
            onCancelSequence="closeModalAndReturnToDashboardSequence"
          />
        )}
      </>
    );
  },
);
UpdatedFilePetition.displayName = 'UpdatedFilePetition';