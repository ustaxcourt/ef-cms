import { BUSINESS_TYPES } from '@shared/business/entities/EntityConstants';
import { ContactPrimaryUpdated } from '@web-client/views/StartCase/ContactPrimaryUpdated';
import { CorporateDisclosureUpload } from './CorporateDisclosureUpload';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import React from 'react';

export function BusinessInfo({
  businessFieldNames,
  form,
  isPetitioner,
  petitionGenerationLiveValidationSequence,
  registerRef,
  updateFilingTypeSequence,
  updateFormValueCountryTypeSequence,
  updateFormValueUpdatedSequence,
  validationErrors,
}) {
  const selectedBusinessType = form.businessType;
  return (
    <div className="ustc-secondary-question">
      <FormGroup
        errorMessageId="business-type-error-message"
        errorText={validationErrors.businessType}
      >
        <fieldset className="usa-fieldset" id="business-type-radios">
          <legend id="business-type-legend">
            What type of business are you filing for?
          </legend>
          {[
            BUSINESS_TYPES.corporation,
            BUSINESS_TYPES.partnershipAsTaxMattersPartner,
            BUSINESS_TYPES.partnershipOtherThanTaxMatters,
            BUSINESS_TYPES.partnershipBBA,
          ].map((businessType, idx) => (
            <div className="usa-radio max-width-fit-content" key={businessType}>
              <input
                aria-describedby="business-type-legend"
                checked={selectedBusinessType === businessType}
                className="usa-radio__input"
                id={`businessType-${businessType}`}
                name="businessType"
                type="radio"
                value={businessType}
                onChange={e => {
                  updateFilingTypeSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
              <label
                className="usa-radio__label business-type-radio-option"
                data-testid={`business-type-${idx}`}
                htmlFor={`businessType-${businessType}`}
                id={`is-business-type-${idx}`}
              >
                {businessType}
              </label>
            </div>
          ))}
        </fieldset>
      </FormGroup>

      {selectedBusinessType && (
        <div>
          <ContactPrimaryUpdated
            addressInfo={form.contactPrimary}
            handleBlur={petitionGenerationLiveValidationSequence}
            handleChange={updateFormValueUpdatedSequence}
            handleChangeCountryType={updateFormValueCountryTypeSequence}
            nameLabel={businessFieldNames.primary}
            placeOfLegalResidenceTitle="Place of business"
            registerRef={registerRef}
            secondaryLabel={businessFieldNames.secondary}
            showEmail={!isPetitioner}
            showInCareOf={businessFieldNames.showInCareOf}
            showInCareOfOptional={businessFieldNames.showInCareOfOptional}
          />
          <CorporateDisclosureUpload
            hasCorporateDisclosureFile={form.corporateDisclosureFile}
            validationErrors={validationErrors}
          />
        </div>
      )}
    </div>
  );
}
