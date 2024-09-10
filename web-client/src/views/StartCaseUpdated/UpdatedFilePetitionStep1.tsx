import { BusinessInfo } from './BusinessInfo';
import { ContactPrimaryUpdated } from '@web-client/views/StartCase/ContactPrimaryUpdated';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { OtherInfo } from './OtherInfo';
import { PetitionerAndSpouseInfo } from './PetitionerAndSpouseInfo';
import { UpdatedFilePetitionButtons } from '@web-client/views/StartCaseUpdated/UpdatedFilePetitionButtons';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import { useValidationFocus } from '@web-client/views/UseValidationFocus';
import React from 'react';

export const UpdatedFilePetitionStep1 = connect(
  {
    form: state.form,
    petitionGenerationLiveValidationSequence:
      sequences.petitionGenerationLiveValidationSequence,
    resetSecondaryAddressSequence: sequences.resetSecondaryAddressSequence,
    updateFilingTypeSequence: sequences.updateFilingTypeSequence,
    updateFormValueCountryTypeSequence:
      sequences.updateFormValueCountryTypeSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updateFormValueUpdatedSequence: sequences.updateFormValueUpdatedSequence,
    updatedFilePetitionHelper: state.updatedFilePetitionHelper,
    validationErrors: state.validationErrors,
  },
  function UpdatedFilePetitionStep1({
    form,
    petitionGenerationLiveValidationSequence,
    resetSecondaryAddressSequence,
    updatedFilePetitionHelper,
    updateFilingTypeSequence,
    updateFormValueCountryTypeSequence,
    updateFormValueSequence,
    updateFormValueUpdatedSequence,
    validationErrors,
  }) {
    const { registerRef, resetFocus } = useValidationFocus(validationErrors);
    const { isPetitioner, isPractitioner } = updatedFilePetitionHelper;
    return (
      <>
        <p className="margin-top-0 required-statement">
          *All fields required unless otherwise noted
        </p>
        <h2>I am filing this Petition on behalf of...</h2>
        <FormGroup
          errorMessageId="filling-type-error-message"
          errorText={validationErrors.filingType}
        >
          <fieldset className="usa-fieldset margin-bottom-2">
            {updatedFilePetitionHelper.filingOptions.map(
              (filingType, index) => {
                return (
                  <div
                    className="usa-radio margin-bottom-2 filing-type-radio-option max-width-fit-content"
                    key={filingType.value}
                  >
                    <input
                      aria-describedby="filing-type-legend"
                      checked={form.filingType === filingType.value}
                      className="usa-radio__input"
                      id={filingType.value}
                      name="filingType"
                      type="radio"
                      value={filingType.value}
                      onChange={e => {
                        updateFilingTypeSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                    <label
                      className="usa-radio__label"
                      data-testid={`filing-type-${index}`}
                      htmlFor={filingType.value}
                      id={`${filingType.value}-radio-option-label`}
                    >
                      {filingType.label}
                    </label>
                  </div>
                );
              },
            )}{' '}
          </fieldset>
        </FormGroup>

        {(form.filingType === 'Myself' ||
          form.filingType === 'Individual petitioner') && (
          <ContactPrimaryUpdated
            addressInfo={form.contactPrimary}
            handleBlur={petitionGenerationLiveValidationSequence}
            handleChange={updateFormValueUpdatedSequence}
            handleChangeCountryType={updateFormValueCountryTypeSequence}
            nameLabel={updatedFilePetitionHelper.primaryContactNameLabel}
            registerRef={registerRef}
            showEmail={isPractitioner}
          />
        )}
        {(form.filingType === 'Myself and my spouse' ||
          form.filingType === 'Petitioner and spouse') && (
          <>
            {isPractitioner && <h2>Petitioner&#39;s information</h2>}
            <ContactPrimaryUpdated
              addressInfo={form.contactPrimary}
              handleBlur={petitionGenerationLiveValidationSequence}
              handleChange={updateFormValueUpdatedSequence}
              handleChangeCountryType={updateFormValueCountryTypeSequence}
              nameLabel={updatedFilePetitionHelper.primaryContactNameLabel}
              registerRef={registerRef}
              showEmail={isPractitioner}
            />
            <h2 data-testid="spouse-header">
              {isPetitioner ? "Your spouse's" : 'Petitioner Spouse'} information
            </h2>
            <PetitionerAndSpouseInfo
              form={form}
              isPetitioner={isPetitioner}
              petitionGenerationLiveValidationSequence={
                petitionGenerationLiveValidationSequence
              }
              registerRef={registerRef}
              resetSecondaryAddressSequence={resetSecondaryAddressSequence}
              updateFilingTypeSequence={updateFilingTypeSequence}
              updateFormValueCountryTypeSequence={
                updateFormValueCountryTypeSequence
              }
              updateFormValueSequence={updateFormValueSequence}
              updateFormValueUpdatedSequence={updateFormValueUpdatedSequence}
              validationErrors={validationErrors}
            />
          </>
        )}
        {form.filingType === 'A business' && (
          <BusinessInfo
            businessFieldNames={updatedFilePetitionHelper.businessFieldNames}
            form={form}
            isPractitioner={isPractitioner}
            petitionGenerationLiveValidationSequence={
              petitionGenerationLiveValidationSequence
            }
            registerRef={registerRef}
            updateFilingTypeSequence={updateFilingTypeSequence}
            updateFormValueCountryTypeSequence={
              updateFormValueCountryTypeSequence
            }
            updateFormValueUpdatedSequence={updateFormValueUpdatedSequence}
            validationErrors={validationErrors}
          />
        )}
        {form.filingType === 'Other' && (
          <OtherInfo
            form={form}
            isPractitioner={isPractitioner}
            otherContactNameLabel={
              updatedFilePetitionHelper.otherContactNameLabel
            }
            otherFilingOptions={updatedFilePetitionHelper.otherFilingOptions}
            petitionGenerationLiveValidationSequence={
              petitionGenerationLiveValidationSequence
            }
            registerRef={registerRef}
            showContactInformationForOtherPartyType={
              updatedFilePetitionHelper.showContactInformationForOtherPartyType
            }
            updateFilingTypeSequence={updateFilingTypeSequence}
            updateFormValueCountryTypeSequence={
              updateFormValueCountryTypeSequence
            }
            updateFormValueUpdatedSequence={updateFormValueUpdatedSequence}
            validationErrors={validationErrors}
          />
        )}

        <UpdatedFilePetitionButtons resetFocus={resetFocus} />
      </>
    );
  },
);
