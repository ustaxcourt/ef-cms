import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

let PREVIOUS_STEP = 0;

export const StepIndicator = connect(
  {
    stepIndicatorInfo: state.stepIndicatorInfo,
  },
  function StepIndicator({ stepIndicatorInfo }) {
    const { currentStep, steps } = stepIndicatorInfo;

    if (PREVIOUS_STEP !== currentStep) {
      PREVIOUS_STEP = currentStep;
      window.scrollTo(0, 0);
    }

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
                  <span className="usa-step-indicator__segment-label">
                    {title}
                    <AccessibilitySpan
                      completed={completed}
                      isCurrentStep={isCurrentStep}
                    />
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="usa-step-indicator__header">
            <h4
              className={classNames(
                'usa-step-indicator__heading',
                'display-flex-center',
              )}
            >
              <span
                className={classNames(
                  'usa-step-indicator__heading-counter',
                  'display-flex-center',
                )}
              >
                <span className="usa-sr-only">Step</span>
                <span
                  className={classNames(
                    'usa-step-indicator__current-step',
                    'display-flex-center',
                    'justify-content-center',
                  )}
                  data-testid={`step-indicator-current-step-${currentStep}-icon`}
                >
                  {currentStep}
                </span>
                <span
                  className={classNames(
                    'usa-step-indicator__total-steps',
                    'margin-left-5',
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
