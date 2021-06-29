import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const ServiceIndicatorRadios = connect(
  {
    SERVICE_INDICATOR_TYPES: state.constants.SERVICE_INDICATOR_TYPES,
    bindKey: props.bind,
    bindObject: state[props.bind],
    cerebralBindSimpleSetStateSequence:
      sequences.cerebralBindSimpleSetStateSequence,
    getValidationError: props.getValidationError,
    hideElectronic: props.hideElectronic,
    validationErrors: state[props.validationErrors],
  },
  function ServiceIndicatorRadios({
    bindKey,
    bindObject,
    cerebralBindSimpleSetStateSequence,
    getValidationError,
    hideElectronic,
    SERVICE_INDICATOR_TYPES,
    validateSequence,
    validationErrors,
  }) {
    const selectElectronic =
      bindObject.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_ELECTRONIC;
    const selectPaper =
      bindObject.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_PAPER;
    const selectNone =
      bindObject.serviceIndicator === SERVICE_INDICATOR_TYPES.SI_NONE;

    return (
      <FormGroup
        className="margin-bottom-0"
        errorText={
          getValidationError
            ? getValidationError()
            : validationErrors?.serviceIndicator
        }
      >
        <fieldset
          className="usa-fieldset margin-bottom-2"
          id={`service-type-radios-${bindKey}`}
        >
          <legend htmlFor={`service-type-radios-${bindKey}`}>
            Service preference
          </legend>
          {!hideElectronic && (
            <div className="usa-radio usa-radio__inline">
              <input
                aria-describedby={`service-type-radios-${bindKey}`}
                checked={selectElectronic}
                className="usa-radio__input"
                id={`service-type-electronic-${bindKey}`}
                name={`${bindKey}.serviceIndicator`}
                type="radio"
                value="Electronic"
                onChange={e => {
                  cerebralBindSimpleSetStateSequence({
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
          )}
          <div className="usa-radio usa-radio__inline">
            <input
              aria-describedby={`service-type-radios-${bindKey}`}
              checked={selectPaper}
              className="usa-radio__input"
              id={`service-type-paper-${bindKey}`}
              name={`${bindKey}.serviceIndicator`}
              type="radio"
              value="Paper"
              onChange={e => {
                cerebralBindSimpleSetStateSequence({
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
              checked={selectNone}
              className="usa-radio__input"
              id={`service-type-none-${bindKey}`}
              name={`${bindKey}.serviceIndicator`}
              type="radio"
              value="None"
              onChange={e => {
                cerebralBindSimpleSetStateSequence({
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
