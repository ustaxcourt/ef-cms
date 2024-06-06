import { Button } from '@web-client/ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const UpdatedFilePetitionButtons = connect(
  {
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    isNextButtonDisabled: props.isNextButtonDisabled,
    primaryLabel: props.primaryLabel,
    resetFocus: props.resetFocus,
    stepIndicatorInfo: state.stepIndicatorInfo,
    updatedFilePetitionCompleteStep1Sequence:
      sequences.updatedFilePetitionCompleteStep1Sequence,
    updatedFilePetitionCompleteStep2Sequence:
      sequences.updatedFilePetitionCompleteStep2Sequence,
    updatedFilePetitionCompleteStep3Sequence:
      sequences.updatedFilePetitionCompleteStep3Sequence,
    updatedFilePetitionCompleteStep4Sequence:
      sequences.updatedFilePetitionCompleteStep4Sequence,
    updatedFilePetitionCompleteStep5Sequence:
      sequences.updatedFilePetitionCompleteStep5Sequence,
    updatedFilePetitionCompleteStep6Sequence:
      sequences.updatedFilePetitionCompleteStep6Sequence,
    updatedFilePetitionGoBackAStepSequence:
      sequences.updatedFilePetitionGoBackAStepSequence,
    validationErrors: state.validationErrors,
  },
  function UpdatedFilePetition({
    formCancelToggleCancelSequence,
    isNextButtonDisabled,
    primaryLabel,
    resetFocus,
    stepIndicatorInfo,
    updatedFilePetitionCompleteStep1Sequence,
    updatedFilePetitionCompleteStep2Sequence,
    updatedFilePetitionCompleteStep3Sequence,
    updatedFilePetitionCompleteStep4Sequence,
    updatedFilePetitionCompleteStep5Sequence,
    updatedFilePetitionCompleteStep6Sequence,
    updatedFilePetitionGoBackAStepSequence,
  }) {
    const { currentStep } = stepIndicatorInfo;
    const NEXT_SEQUENCE = {
      1: updatedFilePetitionCompleteStep1Sequence,
      2: updatedFilePetitionCompleteStep2Sequence,
      3: updatedFilePetitionCompleteStep3Sequence,
      4: updatedFilePetitionCompleteStep4Sequence,
      5: updatedFilePetitionCompleteStep5Sequence,
      6: updatedFilePetitionCompleteStep6Sequence,
    };

    return (
      <>
        <Button
          data-testid={`step-${currentStep}-next-button`}
          disabled={isNextButtonDisabled}
          onClick={e => {
            if (resetFocus) {
              e.preventDefault();
              resetFocus();
            }
            NEXT_SEQUENCE[currentStep]();
          }}
        >
          {primaryLabel || 'Next'}
        </Button>
        {currentStep > 1 && (
          <Button
            secondary
            onClick={() => {
              updatedFilePetitionGoBackAStepSequence();
            }}
          >
            Back
          </Button>
        )}
        <Button
          link
          onClick={() => {
            formCancelToggleCancelSequence();
          }}
        >
          Cancel
        </Button>
      </>
    );
  },
);

UpdatedFilePetitionButtons.displayName = 'UpdatedFilePetitionButtons';
