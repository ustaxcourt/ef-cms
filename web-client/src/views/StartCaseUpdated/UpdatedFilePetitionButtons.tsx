import { Button } from '@web-client/ustc-ui/Button/Button';
import { props as cerebralProps } from 'cerebral';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

const props = cerebralProps as unknown as {
  isNextButtonDisabled: boolean;
  primaryLabel: string;
  resetFocus: () => void;
};

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
          className="create-petition-navigation-buttons"
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
            className="create-petition-navigation-buttons create-petition-navigation-follow-up-buttons"
            onClick={() => {
              updatedFilePetitionGoBackAStepSequence();
            }}
          >
            Back
          </Button>
        )}
        <Button
          link
          className="create-petition-navigation-buttons create-petition-navigation-follow-up-buttons"
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
