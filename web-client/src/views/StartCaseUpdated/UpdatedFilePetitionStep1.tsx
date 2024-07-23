import {
  BUSINESS_TYPES,
  ESTATE_TYPES,
  MAX_FILE_SIZE_MB,
  OTHER_TYPES,
} from '@shared/business/entities/EntityConstants';
import { Button } from '@web-client/ustc-ui/Button/Button';
import { ContactPrimaryUpdated } from '@web-client/views/StartCase/ContactPrimaryUpdated';
import { ContactSecondaryUpdated } from '@web-client/views/StartCase/ContactSecondaryUpdated';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { InfoNotificationComponent } from '@web-client/views/InfoNotification';
import { StateDrivenFileInput } from '@web-client/views/FileDocument/StateDrivenFileInput';
import { UpdatedFilePetitionButtons } from '@web-client/views/StartCaseUpdated/UpdatedFilePetitionButtons';
import { WarningNotificationComponent } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import { useValidationFocus } from '@web-client/views/UseValidationFocus';
import React from 'react';
import classNames from 'classnames';

/* eslint-disable max-lines */
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

    return (
      <>
        <p className="margin-top-0 required-statement">
          *All fields required unless otherwise noted
        </p>
        <h2>I am filing this petition on behalf of...</h2>
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
                    key={filingType}
                  >
                    <input
                      aria-describedby="filing-type-legend"
                      checked={form.filingType === filingType}
                      className="usa-radio__input"
                      id={filingType}
                      name="filingType"
                      type="radio"
                      value={filingType}
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
                      htmlFor={filingType}
                      id={`${filingType}-radio-option-label`}
                    >
                      {filingType}
                    </label>
                  </div>
                );
              },
            )}{' '}
          </fieldset>
        </FormGroup>

        {form.filingType === 'Myself' && (
          <ContactPrimaryUpdated
            addressInfo={form.contactPrimary}
            handleBlur={petitionGenerationLiveValidationSequence}
            handleChange={updateFormValueUpdatedSequence}
            handleChangeCountryType={updateFormValueCountryTypeSequence}
            nameLabel="Full Name"
            registerRef={registerRef}
          />
        )}
        {form.filingType === 'Myself and my spouse' && (
          <>
            <ContactPrimaryUpdated
              addressInfo={form.contactPrimary}
              handleBlur={petitionGenerationLiveValidationSequence}
              handleChange={updateFormValueUpdatedSequence}
              handleChangeCountryType={updateFormValueCountryTypeSequence}
              nameLabel="Full Name"
              registerRef={registerRef}
            />
            <PetitionerAndSpouseInfo
              form={form}
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
            otherContactNameLabel={
              updatedFilePetitionHelper.otherContactNameLabel
            }
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

function PetitionerAndSpouseInfo({
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

function Spouse({
  contactSecondary,
  hasSpouseConsent,
  petitionGenerationLiveValidationSequence,
  registerRef,
  resetSecondaryAddressSequence,
  updateFormValueCountryTypeSequence,
  updateFormValueSequence,
  updateFormValueUpdatedSequence,
  useSameAsPrimary,
  validationErrors,
}) {
  return (
    <>
      <WarningNotificationComponent
        alertWarning={{
          message:
            'To file on behalf of your spouse, you must have consent. If you do not have your spouse\'s consent, select "Myself" as the person who is filing.',
        }}
        dismissible={false}
        scrollToTop={false}
      />
      <FormGroup
        className={classNames(
          validationErrors.hasSpouseConsent && 'usa-form-group--error',
        )}
        errorMessageId="has-spouse-consent-error-message"
        errorText={validationErrors.hasSpouseConsent}
      >
        <input
          checked={hasSpouseConsent || false}
          className="usa-checkbox__input"
          id="spouse-consent"
          name="hasSpouseConsent"
          ref={registerRef && registerRef('hasSpouseConsent')}
          type="checkbox"
          onChange={e => {
            updateFormValueSequence({
              key: e.target.name,
              value: e.target.checked,
            });
            resetSecondaryAddressSequence({
              key: e.target.name,
              value: e.target.checked,
            });
          }}
        />
        <label
          className="usa-checkbox__label"
          data-testid="have-spouse-consent-label"
          htmlFor="spouse-consent"
        >
          {"I have my spouse's consent"}
        </label>
      </FormGroup>
      {hasSpouseConsent && (
        <ContactSecondaryUpdated
          addressInfo={contactSecondary}
          handleBlur={petitionGenerationLiveValidationSequence}
          handleChange={updateFormValueUpdatedSequence}
          handleChangeCountryType={updateFormValueCountryTypeSequence}
          nameLabel="Full name of spouse"
          registerRef={registerRef}
          showSameAsPrimaryCheckbox={true}
          useSameAsPrimary={useSameAsPrimary}
        />
      )}
    </>
  );
}

function BusinessInfo({
  businessFieldNames,
  form,
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

function CorporateDisclosureUpload({
  hasCorporateDisclosureFile,
  validationErrors,
}) {
  return (
    <>
      <h2 className="margin-top-4">Corporate Disclosure Statement</h2>
      <InfoNotificationComponent
        alertInfo={{
          inlineLinkText: 'Tax Court Rule 60',
          inlineLinkUrl: 'https://ustaxcourt.gov/rules.html',
          message:
            'Tax Court Rule 60 requires a corporation, partnership, or limited liability company filing a Petition with the Court to also file a Corporate Disclosure Statement (CDS).',
        }}
        dismissible={false}
        scrollToTop={false}
      />
      <div>
        {"Download and fill out the form if you haven't already done so:"}
      </div>
      <Button
        link
        className="usa-link--external text-left mobile-text-wrap"
        href="https://www.ustaxcourt.gov/resources/forms/Corporate_Disclosure_Statement_Form.pdf"
        overrideMargin="margin-right-0"
        rel="noopener noreferrer"
        target="_blank"
      >
        Corporate Disclosure Statement (T.C. Form 6)
      </Button>
      <div className="margin-top-205">
        <FormGroup
          errorMessageId="corporate-disclosure-file-error-message"
          errorText={
            validationErrors.corporateDisclosureFile ||
            validationErrors.corporateDisclosureFileSize
          }
        >
          <label
            className={classNames(
              'ustc-upload-cds usa-label with-hint',
              hasCorporateDisclosureFile && 'validated',
            )}
            data-testid="corporate-disclosure-file-label"
            htmlFor="corporate-disclosure-file"
            id="corporate-disclosure-file-label"
          >
            Upload the Corporate Disclosure Statement PDF (.pdf)
          </label>
          <span className="usa-hint">
            Make sure file is not encrypted or password protected. Max file size{' '}
            {MAX_FILE_SIZE_MB}MB.
          </span>
          <StateDrivenFileInput
            aria-describedby="corporate-disclosure-file-label"
            id="corporate-disclosure-file"
            name="corporateDisclosureFile"
            updateFormValueSequence="updateFormValueUpdatedSequence"
            validationSequence="petitionGenerationLiveValidationSequence"
          />
        </FormGroup>
      </div>
    </>
  );
}

function OtherInfo({
  form,
  otherContactNameLabel,
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
          {[
            'An estate or trust',
            'A minor or legally incompetent person',
            'Donor',
            'Transferee',
            'Deceased Spouse',
          ].map((otherType, idx) => (
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

function OtherContactInformation({
  form,
  otherContactNameLabel,
  petitionGenerationLiveValidationSequence,
  registerRef,
  updateFormValueCountryTypeSequence,
  updateFormValueUpdatedSequence,
}) {
  return (
    <ContactPrimaryUpdated
      addressInfo={form.contactPrimary}
      handleBlur={petitionGenerationLiveValidationSequence}
      handleChange={updateFormValueUpdatedSequence}
      handleChangeCountryType={updateFormValueCountryTypeSequence}
      nameLabel={otherContactNameLabel.primaryLabel}
      registerRef={registerRef}
      secondaryLabel={otherContactNameLabel.secondaryLabel}
      showInCareOf={otherContactNameLabel.showInCareOf}
      showInCareOfOptional={otherContactNameLabel.showInCareOfOptional}
      titleLabel={otherContactNameLabel.titleLabel}
      titleLabelNote={otherContactNameLabel.titleLabelNote}
    />
  );
}

function SecondaryEstateOptions({
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

function SecondaryMinorIncompetentOptions({
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
          <legend id="estate-type-legend">
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
