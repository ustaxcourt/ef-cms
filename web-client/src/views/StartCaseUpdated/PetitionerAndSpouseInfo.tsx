import { ContactSecondaryUpdated } from '@web-client/views/StartCase/ContactSecondaryUpdated';
import { Spouse } from './Spouse';
import React from 'react';
import classNames from 'classnames';

export function PetitionerAndSpouseInfo({
  form,
  petitionGenerationLiveValidationSequence,
  registerRef,
  resetSecondaryAddressSequence,
  updateFilingTypeSequence,
  updateFormValueCountryTypeSequence,
  updateFormValueSequence,
  updateFormValueUpdatedSequence,
  validationErrors,
}) {
  const {
    contactSecondary,
    hasSpouseConsent,
    isSpouseDeceased: isSpouseDeceasedSelected,
    useSameAsPrimary,
  } = form;

  return (
    <div
      className={classNames(
        'ustc-secondary-question',
        validationErrors.isSpouseDeceased && 'usa-form-group--error',
      )}
    >
      <h2>Your spouse&#39;s information</h2>
      <fieldset className="usa-fieldset usa-sans" id="deceased-spouse-radios">
        <legend id="deceased-spouse-legend">Is your spouse deceased?</legend>
        {['Yes', 'No'].map((isSpouseDeceased, idx) => (
          <div className="usa-radio usa-radio__inline" key={isSpouseDeceased}>
            <input
              aria-describedby="deceased-spouse-radios"
              checked={isSpouseDeceasedSelected === isSpouseDeceased}
              className="usa-radio__input"
              id={`isSpouseDeceased-${isSpouseDeceased}`}
              name="isSpouseDeceased"
              ref={registerRef && registerRef('isSpouseDeceased')}
              type="radio"
              value={isSpouseDeceased}
              onChange={e => {
                updateFilingTypeSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
              }}
            />
            <label
              className="usa-radio__label"
              data-testid={`is-spouse-deceased-${idx}`}
              htmlFor={`isSpouseDeceased-${isSpouseDeceased}`}
              id={`is-spouse-deceased-${idx}`}
            >
              {isSpouseDeceased}
            </label>
          </div>
        ))}

        {validationErrors.isSpouseDeceased && (
          <span
            className="usa-error-message"
            data-testid="is-spouse-deceased-error-message"
          >
            {validationErrors.isSpouseDeceased}
          </span>
        )}
      </fieldset>
      {isSpouseDeceasedSelected === 'Yes' && (
        <ContactSecondaryUpdated
          displayInCareOf
          showSameAsPrimaryCheckbox
          addressInfo={contactSecondary}
          handleBlur={petitionGenerationLiveValidationSequence}
          handleChange={updateFormValueUpdatedSequence}
          handleChangeCountryType={updateFormValueCountryTypeSequence}
          nameLabel="Full name of deceased spouse"
          registerRef={registerRef}
          useSameAsPrimary={useSameAsPrimary}
        />
      )}
      {isSpouseDeceasedSelected === 'No' && (
        <Spouse
          contactSecondary={contactSecondary}
          hasSpouseConsent={hasSpouseConsent}
          petitionGenerationLiveValidationSequence={
            petitionGenerationLiveValidationSequence
          }
          registerRef={registerRef}
          resetSecondaryAddressSequence={resetSecondaryAddressSequence}
          updateFormValueCountryTypeSequence={
            updateFormValueCountryTypeSequence
          }
          updateFormValueSequence={updateFormValueSequence}
          updateFormValueUpdatedSequence={updateFormValueUpdatedSequence}
          useSameAsPrimary={useSameAsPrimary}
          validationErrors={validationErrors}
        />
      )}
    </div>
  );
}
