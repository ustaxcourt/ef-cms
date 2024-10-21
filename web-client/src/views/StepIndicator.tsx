import { Button } from '@web-client/ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React, { useEffect } from 'react';
import classNames from 'classnames';

export const StepIndicator = connect(
  {
    stepIndicatorInfo: state.stepIndicatorInfo,
    updateStepIndicatorSequence: sequences.updateStepIndicatorSequence,
  },
  function StepIndicator({ stepIndicatorInfo, updateStepIndicatorSequence }) {
    const { currentStep, steps } = stepIndicatorInfo;

    useEffect(() => {
      window.scrollTo(0, 0);
    }, [currentStep]);

    return (
      <>
        <div aria-label="progress" className="usa-step-indicator">
          <ol className="usa-step-indicator__segments">
            {Object.keys(steps).map(step => {
              const title = steps[step];
              const isCurrentStep = +step === currentStep;
              const completed = +step < currentStep;
              const completedClass = completed
                ? 'usa-step-indicator__segment--complete'
                : '';
              const currentClass = isCurrentStep
                ? 'usa-step-indicator__segment--current'
                : '';
              return (
                <li
                  aria-current={isCurrentStep}
                  className={`usa-step-indicator__segment ${completedClass} ${currentClass}`}
                  key={title}
                >
                  <Button
                    className="usa-button--unstyled no-underline stepper-line-height"
                    disabled={
                      +step > currentStep ||
                      currentStep >= Object.keys(steps).length
                    }
                    onClick={() => {
                      updateStepIndicatorSequence({ step: +step });
                    }}
                  >
                    <span className="usa-step-indicator__segment-label">
                      {title}
                      <AccessibilitySpan
                        completed={completed}
                        isCurrentStep={isCurrentStep}
                      />
                    </span>
                  </Button>
                </li>
              );
            })}
          </ol>
          <div className="usa-step-indicator__header">
            <h4
              className={classNames(
                'usa-step-indicator__heading',
                'display-flex',
                'flex-align-center',
              )}
            >
              <span
                className={classNames(
                  'usa-step-indicator__heading-counter',
                  'display-flex',
                  'flex-align-center',
                )}
              >
                <span className="usa-sr-only">Step</span>
                <span
                  className={classNames(
                    'usa-step-indicator__current-step',
                    'display-flex',
                    'flex-align-center',
                    'flex-justify-center',
                  )}
                  data-testid={`step-indicator-current-step-${currentStep}-icon`}
                >
                  {currentStep}
                </span>
                <span
                  className={classNames(
                    'usa-step-indicator__total-steps',
                    'margin-left-05',
                    'no-wrap',
                  )}
                >
                  of {Object.keys(steps).length}
                </span>{' '}
              </span>
              <span className="usa-step-indicator__heading-text">
                {steps[currentStep]}
              </span>
            </h4>
          </div>
        </div>
      </>
    );
  },
);

StepIndicator.displayName = 'StepIndicator';

function AccessibilitySpan(isCurrentStep, completed) {
  if (isCurrentStep) return;
  return (
    <span className="usa-sr-only">
      {completed ? 'completed' : 'not completed'}
    </span>
  );
}
