import { Button } from '@web-client/ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

type FilePetitionButtonsProps = {
  isNextButtonDisabled?: boolean;
  primaryLabel?: string;
  resetFocus?: () => void;
};

const filePetitionButtonsDependencies = {
  filePetitionCompleteStep1Sequence:
    sequences.filePetitionCompleteStep1Sequence,
  filePetitionCompleteStep2Sequence:
    sequences.filePetitionCompleteStep2Sequence,
  filePetitionCompleteStep3Sequence:
    sequences.filePetitionCompleteStep3Sequence,
  filePetitionCompleteStep4Sequence:
    sequences.filePetitionCompleteStep4Sequence,
  filePetitionCompleteStep5Sequence:
    sequences.filePetitionCompleteStep5Sequence,
  filePetitionCompleteStep6Sequence:
    sequences.filePetitionCompleteStep6Sequence,
  filePetitionGoBackAStepSequence: sequences.filePetitionGoBackAStepSequence,
  formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
  stepIndicatorInfo: state.stepIndicatorInfo,
  validationErrors: state.validationErrors,
};

export const FilePetitionButtons = connect<
  FilePetitionButtonsProps,
  typeof filePetitionButtonsDependencies
>(
  filePetitionButtonsDependencies,
  function UpdatedFilePetition({
    filePetitionCompleteStep1Sequence,
    filePetitionCompleteStep2Sequence,
    filePetitionCompleteStep3Sequence,
    filePetitionCompleteStep4Sequence,
    filePetitionCompleteStep5Sequence,
    filePetitionCompleteStep6Sequence,
    filePetitionGoBackAStepSequence,
    formCancelToggleCancelSequence,
    isNextButtonDisabled,
    primaryLabel,
    resetFocus,
    stepIndicatorInfo,
  }) {
    const { currentStep } = stepIndicatorInfo;
    const NEXT_SEQUENCE = {
      1: filePetitionCompleteStep1Sequence,
      2: filePetitionCompleteStep2Sequence,
      3: filePetitionCompleteStep3Sequence,
      4: filePetitionCompleteStep4Sequence,
      5: filePetitionCompleteStep5Sequence,
      6: filePetitionCompleteStep6Sequence,
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
              filePetitionGoBackAStepSequence();
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

FilePetitionButtons.displayName = 'FilePetitionButtons';
