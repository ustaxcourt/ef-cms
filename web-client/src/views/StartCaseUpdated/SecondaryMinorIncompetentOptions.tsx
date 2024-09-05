import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { OTHER_TYPES } from '@shared/business/entities/EntityConstants';
import React from 'react';

export function SecondaryMinorIncompetentOptions({
  selectedMinorIncompetentType,
  updateFilingTypeSequence,
  validationErrors,
}) {
  return (
    <div className="ustc-secondary-question">
      <FormGroup
        errorMessageId="minor-incompetent-type-error-message"
        errorText={validationErrors.minorIncompetentType}
      >
        <fieldset className="usa-fieldset usa-sans" id="estate-type-radios">
          <legend data-testid="estate-type-legend" id="estate-type-legend">
            What is your role in filing for this minor or legally incompetent
            person?
          </legend>
          {[
            OTHER_TYPES.conservator,
            OTHER_TYPES.guardian,
            OTHER_TYPES.custodian,
            OTHER_TYPES.nextFriendForMinor,
            OTHER_TYPES.nextFriendForIncompetentPerson,
          ].map((minorIncompetentType, idx) => (
            <div
              className="usa-radio max-width-fit-content"
              key={minorIncompetentType}
            >
              <input
                aria-describedby="minorIncompetent-type-legend"
                checked={selectedMinorIncompetentType === minorIncompetentType}
                className="usa-radio__input"
                id={`minorIncompetentType-${minorIncompetentType}`}
                name="minorIncompetentType"
                type="radio"
                value={minorIncompetentType}
                onChange={e => {
                  updateFilingTypeSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
              <label
                className="usa-radio__label"
                data-testid={`minor-incompetent-type-radio-option-${idx}`}
                htmlFor={`minorIncompetentType-${minorIncompetentType}`}
                id={`is-minorIncompetent-type-${idx}`}
              >
                {minorIncompetentType}
              </label>
            </div>
          ))}
        </fieldset>
      </FormGroup>
    </div>
  );
}
