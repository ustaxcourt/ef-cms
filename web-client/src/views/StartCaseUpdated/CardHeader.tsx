import { Button } from '@web-client/ustc-ui/Button/Button';
import { props as cerebralProps } from 'cerebral';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

const props = cerebralProps as unknown as {
  step: number;
  title: string;
};

export const CardHeader = connect(
  {
    step: props.step,
    title: props.title,
    updateStepIndicatorSequence: sequences.updateStepIndicatorSequence,
  },
  function CardHeader({ step, title, updateStepIndicatorSequence }) {
    return (
      <h3 className="create-petition-review-step-title">
        <div>
          {step}. {title}
        </div>
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
      </h3>
    );
  },
);
