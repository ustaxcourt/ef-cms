import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { OtherContactInformation } from './OtherContactInformation';
import { SecondaryEstateOptions } from './SecondaryEstateOptions';
import { SecondaryMinorIncompetentOptions } from './SecondaryMinorIncompetentOptions';
import React from 'react';

export function OtherInfo({
  form,
  isPetitioner,
  otherContactNameLabel,
  otherFilingOptions,
  petitionGenerationLiveValidationSequence,
  registerRef,
  showContactInformationForOtherPartyType,
  updateFilingTypeSequence,
  updateFormValueCountryTypeSequence,
  updateFormValueUpdatedSequence,
  validationErrors,
}) {
  const selectedEstateType = form.estateType;
  const selectedMinorIncompetentType = form.minorIncompetentType;
  const selectedOtherType = form.otherType;

  return (
    <div className="ustc-secondary-question">
      <FormGroup
        errorMessageId="other-type-error-message"
        errorText={validationErrors.otherType}
      >
        <fieldset className="usa-fieldset" id="other-type-radios">
          <legend id="other-type-legend">
            What other type of taxpayer are you filing for?
          </legend>
          {otherFilingOptions.map((otherType, idx) => (
            <div className="usa-radio max-width-fit-content" key={otherType}>
              <input
                aria-describedby="other-type-legend"
                checked={selectedOtherType === otherType}
                className="usa-radio__input"
                id={`otherType-${otherType}`}
                name="otherType"
                type="radio"
                value={otherType}
                onChange={e => {
                  updateFilingTypeSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
              <label
                className="usa-radio__label"
                data-testid={`other-type-radio-option-${idx}`}
                htmlFor={`otherType-${otherType}`}
                id={`is-other-type-${idx}`}
              >
                {otherType}
              </label>
            </div>
          ))}
        </fieldset>
      </FormGroup>
      {selectedOtherType === 'An estate or trust' && (
        <SecondaryEstateOptions
          selectedEstateType={selectedEstateType}
          updateFilingTypeSequence={updateFilingTypeSequence}
          validationErrors={validationErrors}
        />
      )}
      {selectedOtherType === 'A minor or legally incompetent person' && (
        <SecondaryMinorIncompetentOptions
          selectedMinorIncompetentType={selectedMinorIncompetentType}
          updateFilingTypeSequence={updateFilingTypeSequence}
          validationErrors={validationErrors}
        />
      )}
      {showContactInformationForOtherPartyType && (
        <OtherContactInformation
          form={form}
          isPetitioner={isPetitioner}
          otherContactNameLabel={otherContactNameLabel}
          petitionGenerationLiveValidationSequence={
            petitionGenerationLiveValidationSequence
          }
          registerRef={registerRef}
          updateFormValueCountryTypeSequence={
            updateFormValueCountryTypeSequence
          }
          updateFormValueUpdatedSequence={updateFormValueUpdatedSequence}
        />
      )}
    </div>
  );
}
