import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const ServiceIndicatorRadios = connect(
  {
    bindKey: props.bind,
    bindObject: state[props.bind],
    updateStateSequence: sequences.updateStateSequence,
    validationErrors: state[props.validationErrors],
  },
  ({ bindKey, bindObject, updateStateSequence, validationErrors }) => {
    return (
      <FormGroup errorText={validationErrors.serviceIndicator}>
        <fieldset className="usa-fieldset" id="service-type-radios">
          <legend htmlFor="service-type-radios">Service preference</legend>
          <div className="usa-radio usa-radio__inline">
            <input
              aria-describedby="service-type-radios"
              checked={bindObject.serviceIndicator === 'Electronic'}
              className="usa-radio__input"
              id="service-type-electronic"
              name="serviceIndicator"
              type="radio"
              value="Electronic"
              onChange={e => {
                updateStateSequence({
                  key: `${bindKey}.${e.target.name}`,
                  value: e.target.value,
                });
              }}
            />
            <label
              className="usa-radio__label"
              htmlFor="service-type-electronic"
              id="service-type-label-electronic"
            >
              Electronic
            </label>
          </div>
          <div className="usa-radio usa-radio__inline">
            <input
              aria-describedby="service-type-radios"
              checked={bindObject.serviceIndicator === 'Paper'}
              className="usa-radio__input"
              id="service-type-paper"
              name="serviceIndicator"
              type="radio"
              value="Paper"
              onChange={e => {
                updateStateSequence({
                  key: `${bindKey}.${e.target.name}`,
                  value: e.target.value,
                });
              }}
            />
            <label
              className="usa-radio__label"
              htmlFor="service-type-paper"
              id="service-type-label-paper"
            >
              Paper
            </label>
          </div>
          <div className="usa-radio usa-radio__inline">
            <input
              aria-describedby="service-type-radios"
              checked={bindObject.serviceIndicator === 'None'}
              className="usa-radio__input"
              id="service-type-none"
              name="serviceIndicator"
              type="radio"
              value="None"
              onChange={e => {
                updateStateSequence({
                  key: `${bindKey}.${e.target.name}`,
                  value: e.target.value,
                });
              }}
            />
            <label
              className="usa-radio__label"
              htmlFor="service-type-none"
              id="service-type-label-none"
            >
              None
            </label>
          </div>
        </fieldset>
      </FormGroup>
    );
  },
);
