import { Button } from '@web-client/ustc-ui/Button/Button';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

type CardHeaderType = {
  showEditButton?: boolean;
  step?: number;
  title: string;
};

const cardHeaderDependencies = {
  updateStepIndicatorSequence: sequences.updateStepIndicatorSequence,
};

export const CardHeader = connect<
  CardHeaderType,
  typeof cardHeaderDependencies
>(
  cardHeaderDependencies,
  function CardHeader({
    showEditButton = true,
    step,
    title,
    updateStepIndicatorSequence,
  }) {
    return (
      <h3 className="create-petition-review-step-title">
        <div>
          {step && <span>{step}. </span>}
          {title}
        </div>
        {showEditButton && step && (
          <div>
            <Button
              link
              className="margin-left-2 padding-0"
              data-testid={`edit-petition-section-button-${step}`}
              icon="edit"
              onClick={() => {
                updateStepIndicatorSequence({ step });
              }}
            >
              Edit
            </Button>
          </div>
        )}
      </h3>
    );
  },
);
