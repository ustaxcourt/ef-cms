import { ESTATE_TYPES } from '@shared/business/entities/EntityConstants';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import React from 'react';

export function SecondaryEstateOptions({
  selectedEstateType,
  updateFilingTypeSequence,
  validationErrors,
}) {
  return (
    <div className="ustc-secondary-question">
      <FormGroup
        errorMessageId="estate-type-error-message"
        errorText={validationErrors.estateType}
      >
        <fieldset className="usa-fieldset usa-sans" id="estate-type-radios">
          <legend id="estate-type-legend">
            What type of estate or trust are you filing for?
          </legend>
          {[
            ESTATE_TYPES.estate,
            ESTATE_TYPES.estateWithoutExecutor,
            ESTATE_TYPES.trust,
          ].map((estateType, idx) => (
            <div className="usa-radio max-width-fit-content" key={estateType}>
              <input
                aria-describedby="estate-type-legend"
                checked={selectedEstateType === estateType}
                className="usa-radio__input"
                id={`estateType-${estateType}`}
                name="estateType"
                type="radio"
                value={estateType}
                onChange={e => {
                  updateFilingTypeSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
              <label
                className="usa-radio__label"
                data-testid={`estate-type-radio-option-${idx}`}
                htmlFor={`estateType-${estateType}`}
                id={`is-estate-type-${idx}`}
              >
                {estateType}
              </label>
            </div>
          ))}
        </fieldset>
      </FormGroup>
    </div>
  );
}
