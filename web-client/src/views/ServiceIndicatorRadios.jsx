import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const ServiceIndicatorRadios = connect(
  {
    SERVICE_INDICATOR_TYPES: state.constants.SERVICE_INDICATOR_TYPES,
    bindKey: props.bind,
    bindObject: state[props.bind],
    getValidationError: props.getValidationError,
    updateStateSequence: sequences.updateStateSequence,
    validationErrors: state[props.validationErrors],
  },
  function ServiceIndicatorRadios({
    bindKey,
    bindObject,
    getValidationError,
    SERVICE_INDICATOR_TYPES,
    updateStateSequence,
    validateSequence,
    validationErrors,
  }) {
    return (
      <FormGroup
        className="margin-bottom-0"
        errorText={
          getValidationError
            ? getValidationError()
            : validationErrors && validationErrors.serviceIndicator
        }
      >
        <fieldset
          className="usa-fieldset margin-bottom-2"
          id={`service-type-radios-${bindKey}`}
        >
          <legend htmlFor={`service-type-radios-${bindKey}`}>
            Service preference
          </legend>
          <div className="usa-radio usa-radio__inline">
            <input
              aria-describedby={`service-type-radios-${bindKey}`}
              checked={
                bindObject.serviceIndicator ===
                SERVICE_INDICATOR_TYPES.SI_ELECTRONIC
              }
              className="usa-radio__input"
              id={`service-type-electronic-${bindKey}`}
              name={`${bindKey}.serviceIndicator`}
              type="radio"
              value="Electronic"
              onChange={e => {
                updateStateSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
                validateSequence && validateSequence();
              }}
            />
            <label
              className="usa-radio__label"
              htmlFor={`service-type-electronic-${bindKey}`}
              id={`service-type-electronic-label-${bindKey}`}
            >
              Electronic
            </label>
          </div>
          <div className="usa-radio usa-radio__inline">
            <input
              aria-describedby={`service-type-radios-${bindKey}`}
              checked={
                bindObject.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER
              }
              className="usa-radio__input"
              id={`service-type-paper-${bindKey}`}
              name={`${bindKey}.serviceIndicator`}
              type="radio"
              value="Paper"
              onChange={e => {
                updateStateSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
                validateSequence && validateSequence();
              }}
            />
            <label
              className="usa-radio__label"
              htmlFor={`service-type-paper-${bindKey}`}
              id={`service-type-paper-label-${bindKey}`}
            >
              Paper
            </label>
          </div>
          <div className="usa-radio usa-radio__inline">
            <input
              aria-describedby={`service-type-radios-${bindKey}`}
              checked={
                bindObject.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_NONE
              }
              className="usa-radio__input"
              id={`service-type-none-${bindKey}`}
              name={`${bindKey}.serviceIndicator`}
              type="radio"
              value="None"
              onChange={e => {
                updateStateSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
                validateSequence && validateSequence();
              }}
            />
            <label
              className="usa-radio__label"
              htmlFor={`service-type-none-${bindKey}`}
              id={`service-type-none-label-${bindKey}`}
            >
              None
            </label>
          </div>
        </fieldset>
      </FormGroup>
    );
  },
);
