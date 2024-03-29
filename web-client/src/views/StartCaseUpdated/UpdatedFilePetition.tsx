import { BigHeader } from '@web-client/views/BigHeader';
import { StepIndicator } from '@web-client/views/StepIndicator';
import { UpdatedFilePetitionStep1 } from '@web-client/views/StartCaseUpdated/UpdatedFilePetitionStep1';
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
        </section>
      </>
    );
  },
);
UpdatedFilePetition.displayName = 'UpdatedFilePetition';
