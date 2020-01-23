import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const ServiceIndicatorRadios = connect(
  {
    modal: state[props.bind],
    validationErrors: state[props.validationErrors],
  },
  ({ modal, updateModalValueSequence, validationErrors }) => {
    return (
      <FormGroup errorText={validationErrors.serviceIndicator}>
        <fieldset className="usa-fieldset" id="service-type-radios">
          <legend htmlFor="service-type-radios">Service preference</legend>
          <div className="usa-radio usa-radio__inline">
            <input
              aria-describedby="service-type-radios"
              checked={modal.serviceIndicator === 'Electronic'}
              className="usa-radio__input"
              id="service-type-electronic"
              name="serviceIndicator"
              type="radio"
              value="Electronic"
              onChange={e => {
                updateModalValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
            <label
              className="usa-radio__label"
              htmlFor="service-type-electronic"
              id="service-type-electronic"
            >
              Electronic
            </label>
          </div>
          <div className="usa-radio usa-radio__inline">
            <input
              aria-describedby="service-type-radios"
              checked={modal.serviceIndicator === 'Paper'}
              className="usa-radio__input"
              id="service-type-paper"
              name="serviceIndicator"
              type="radio"
              value="Paper"
              onChange={e => {
                updateModalValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
            <label
              className="usa-radio__label"
              htmlFor="service-type-paper"
              id="service-type-paper"
            >
              Paper
            </label>
          </div>
          <div className="usa-radio usa-radio__inline">
            <input
              aria-describedby="service-type-radios"
              checked={modal.serviceIndicator === 'None'}
              className="usa-radio__input"
              id="service-type-none"
              name="serviceIndicator"
              type="radio"
              value="None"
              onChange={e => {
                updateModalValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
            <label
              className="usa-radio__label"
              htmlFor="service-type-none"
              id="service-type-none"
            >
              None
            </label>
          </div>
        </fieldset>
      </FormGroup>
    );
  },
);
