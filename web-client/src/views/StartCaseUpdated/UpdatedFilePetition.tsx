import { BigHeader } from '@web-client/views/BigHeader';
import { StepIndicator } from '@web-client/views/StepIndicator';
import { UpdatedFilePetitionStep1 } from '@web-client/views/StartCaseUpdated/UpdatedFilePetitionStep1';
import { UpdatedFilePetitionStep2 } from '@web-client/views/StartCaseUpdated/UpdatedFilePetitionStep2';
import { UpdatedFilePetitionStep3 } from '@web-client/views/StartCaseUpdated/UpdatedFilePetitionStep3';
import { UpdatedFilePetitionStep4 } from '@web-client/views/StartCaseUpdated/UpdatedFilePetitionStep4';
import { UpdatedFilePetitionStep5 } from '@web-client/views/StartCaseUpdated/UpdatedFilePetitionStep5';
import { UpdatedFilePetitionStep6 } from '@web-client/views/StartCaseUpdated/UpdatedFilePetitionStep6';
import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const UpdatedFilePetition = connect(
  {
    stepIndicatorInfo: state.stepIndicatorInfo,
  },
  function UpdatedFilePetition({ stepIndicatorInfo }) {
    const { currentStep } = stepIndicatorInfo;
    return (
      <>
        <BigHeader text="Create a Case" />
        <section className="usa-section grid-container">
          <StepIndicator />
          {currentStep === 0 && <UpdatedFilePetitionStep1 />}
          {currentStep === 1 && <UpdatedFilePetitionStep2 />}
          {currentStep === 2 && <UpdatedFilePetitionStep3 />}
          {currentStep === 3 && <UpdatedFilePetitionStep4 />}
          {currentStep === 4 && <UpdatedFilePetitionStep5 />}
          {currentStep === 5 && <UpdatedFilePetitionStep6 />}
        </section>
      </>
    );
  },
);
UpdatedFilePetition.displayName = 'UpdatedFilePetition';
