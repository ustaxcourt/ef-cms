import { connect } from '@web-client/presenter/shared.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const StepIndicator = connect(
  {
    stepIndicatorInfo: state.stepIndicatorInfo,
  },
  function StepIndicator({ stepIndicatorInfo }) {
    const { currentStep, steps } = stepIndicatorInfo;
    return (
      <>
        <div aria-label="progress" className="usa-step-indicator">
          <ol className="usa-step-indicator__segments">
            {steps.map((title, index) => {
              const isCurrentStep = index === currentStep;
              const completed = index < currentStep;
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
                >
                  {currentStep + 1}
                </span>
                <span
                  className={classNames(
                    'usa-step-indicator__total-steps',
                    'margin-left-5',
                  )}
                >
                  of {steps.length}
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
