import { Button } from '@web-client/ustc-ui/Button/Button';
import { ContactPrimaryUpdated } from '@web-client/views/StartCase/ContactPrimaryUpdated';
import { ContactSecondaryUpdated } from '@web-client/views/StartCase/ContactSecondaryUpdated';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { InfoNotificationComponent } from '@web-client/views/InfoNotification';
import { StateDrivenFileInput } from '@web-client/views/FileDocument/StateDrivenFileInput';
import { UpdatedFilePetitionButtons } from '@web-client/views/StartCaseUpdated/UpdatedFilePetitionButtons';
import { WarningNotificationComponent } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import { useValidationFocus } from '@web-client/views/UseValidationFocus';
import React from 'react';
import classNames from 'classnames';

export const UpdatedFilePetitionStep1 = connect(
  {
    constants: state.constants,
    form: state.form,
    resetSecondaryAddressSequence: sequences.resetSecondaryAddressSequence,
    updateFilingTypeSequence: sequences.updateFilingTypeSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updatedFilePetitionHelper: state.updatedFilePetitionHelper,
    validationErrors: state.validationErrors,
  },
  function UpdatedFilePetitionStep1({
    constants,
    form,
    resetSecondaryAddressSequence,
    updatedFilePetitionHelper,
    updateFilingTypeSequence,
    updateFormValueSequence,
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
            bind="form"
            nameLabel="Full Name"
            registerRef={registerRef}
            onBlur="petitionGenerationLiveValidationSequence"
            onChange="updateFormValueUpdatedSequence"
            onChangeCountryType="updateFormValueCountryTypeSequence"
          />
        )}
        {form.filingType === 'Myself and my spouse' && (
          <>
            <ContactPrimaryUpdated
              bind="form"
              nameLabel="Full Name"
              registerRef={registerRef}
              onBlur="petitionGenerationLiveValidationSequence"
              onChange="updateFormValueUpdatedSequence"
              onChangeCountryType="updateFormValueCountryTypeSequence"
            />
            <PetitionerAndSpouseInfo
              hasSpouseConsent={form.hasSpouseConsent}
              isSpouseDeceasedSelected={form.isSpouseDeceased}
              registerRef={registerRef}
              resetSecondaryAddressSequence={resetSecondaryAddressSequence}
              updateFilingTypeSequence={updateFilingTypeSequence}
              updateFormValueSequence={updateFormValueSequence}
              validationErrors={validationErrors}
            />
          </>
        )}
        {form.filingType === 'A business' && (
          <BusinessInfo
            businessFieldNames={updatedFilePetitionHelper.businessFieldNames}
            businessTypes={constants.BUSINESS_TYPES}
            hasCorporateDisclosureFile={form.corporateDisclosureFile}
            maxFileSize={constants.MAX_FILE_SIZE_MB}
            registerRef={registerRef}
            selectedBusinessType={form.businessType}
            updateFilingTypeSequence={updateFilingTypeSequence}
            validationErrors={validationErrors}
          />
        )}
        {form.filingType === 'Other' && (
          <OtherInfo
            estateTypes={constants.ESTATE_TYPES}
            minorIncompetentTypes={constants.OTHER_TYPES}
            otherContactNameLabel={
              updatedFilePetitionHelper.otherContactNameLabel
            }
            registerRef={registerRef}
            selectedEstateType={form.estateType}
            selectedMinorIncompetentType={form.minorIncompetentType}
            selectedOtherType={form.otherType}
            showContactInformationForOtherPartyType={
              updatedFilePetitionHelper.showContactInformationForOtherPartyType
            }
            updateFilingTypeSequence={updateFilingTypeSequence}
            validationErrors={validationErrors}
          />
        )}

        <UpdatedFilePetitionButtons resetFocus={resetFocus} />
      </>
    );
  },
);

function PetitionerAndSpouseInfo({
  hasSpouseConsent,
  isSpouseDeceasedSelected,
  registerRef,
  resetSecondaryAddressSequence,
  updateFilingTypeSequence,
  updateFormValueSequence,
  validationErrors,
}) {
  return (
    <div
      className={classNames(
        'ustc-secondary-question',
        validationErrors.isSpouseDeceased && 'usa-form-group--error',
      )}
    >
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
          bind="form"
          displayInCareOf={true}
          nameLabel="Full name of deceased spouse"
          registerRef={registerRef}
          showSameAsPrimaryCheckbox={true}
          onBlur="petitionGenerationLiveValidationSequence"
          onChange="updateFormValueUpdatedSequence"
          onChangeCountryType="updateFormValueCountryTypeSequence"
        />
      )}
      {isSpouseDeceasedSelected === 'No' && (
        <Spouse
          hasSpouseConsent={hasSpouseConsent}
          registerRef={registerRef}
          resetSecondaryAddressSequence={resetSecondaryAddressSequence}
          updateFormValueSequence={updateFormValueSequence}
          validationErrors={validationErrors}
        />
      )}
    </div>
  );
}

function Spouse({
  hasSpouseConsent,
  registerRef,
  resetSecondaryAddressSequence,
  updateFormValueSequence,
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
          bind="form"
          nameLabel="Full name of spouse"
          registerRef={registerRef}
          showSameAsPrimaryCheckbox={true}
          onBlur="petitionGenerationLiveValidationSequence"
          onChange="updateFormValueUpdatedSequence"
          onChangeCountryType="updateFormValueCountryTypeSequence"
        />
      )}
    </>
  );
}

function BusinessInfo({
  businessFieldNames,
  businessTypes,
  hasCorporateDisclosureFile,
  maxFileSize,
  registerRef,
  selectedBusinessType,
  updateFilingTypeSequence,
  validationErrors,
}) {
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
            businessTypes.corporation,
            businessTypes.partnershipAsTaxMattersPartner,
            businessTypes.partnershipOtherThanTaxMatters,
            businessTypes.partnershipBBA,
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
            bind="form"
            nameLabel={businessFieldNames.primary}
            placeOfLegalResidenceTitle="Place of business"
            registerRef={registerRef}
            secondaryLabel={businessFieldNames.secondary}
            showInCareOf={businessFieldNames.showInCareOf}
            showInCareOfOptional={businessFieldNames.showInCareOfOptional}
            onBlur="petitionGenerationLiveValidationSequence"
            onChange="updateFormValueUpdatedSequence"
          />
          <CorporateDisclosureUpload
            hasCorporateDisclosureFile={hasCorporateDisclosureFile}
            maxFileSize={maxFileSize}
            validationErrors={validationErrors}
          />
        </div>
      )}
    </div>
  );
}

function CorporateDisclosureUpload({
  hasCorporateDisclosureFile,
  maxFileSize,
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
            htmlFor="corporate-disclosure-file"
            id="corporate-disclosure-file-label"
          >
            Upload the Corporate Disclosure Statement PDF (.pdf)
          </label>
          <span className="usa-hint">
            Make sure file is not encrypted or password protected. Max file size{' '}
            {maxFileSize}MB.
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
  estateTypes,
  minorIncompetentTypes,
  otherContactNameLabel,
  registerRef,
  selectedEstateType,
  selectedMinorIncompetentType,
  selectedOtherType,
  showContactInformationForOtherPartyType,
  updateFilingTypeSequence,
  validationErrors,
}) {
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
                data-testid="other-radio-option"
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
          estateTypes={estateTypes}
          selectedEstateType={selectedEstateType}
          updateFilingTypeSequence={updateFilingTypeSequence}
          validationErrors={validationErrors}
        />
      )}
      {selectedOtherType === 'A minor or legally incompetent person' && (
        <SecondaryMinorIncompetentOptions
          minorIncompetentTypes={minorIncompetentTypes}
          selectedMinorIncompetentType={selectedMinorIncompetentType}
          updateFilingTypeSequence={updateFilingTypeSequence}
          validationErrors={validationErrors}
        />
      )}
      {showContactInformationForOtherPartyType && (
        <OtherContactInformation
          otherContactNameLabel={otherContactNameLabel}
          registerRef={registerRef}
        />
      )}
    </div>
  );
}

function OtherContactInformation({ otherContactNameLabel, registerRef }) {
  return (
    <ContactPrimaryUpdated
      bind="form"
      nameLabel={otherContactNameLabel.primaryLabel}
      registerRef={registerRef}
      secondaryLabel={otherContactNameLabel.secondaryLabel}
      showInCareOf={otherContactNameLabel.showInCareOf}
      showInCareOfOptional={otherContactNameLabel.showInCareOfOptional}
      titleLabel={otherContactNameLabel.titleLabel}
      titleLabelNote={otherContactNameLabel.titleLabelNote}
      onBlur="petitionGenerationLiveValidationSequence"
      onChange="updateFormValueUpdatedSequence"
    />
  );
}

function SecondaryEstateOptions({
  estateTypes,
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
            estateTypes.estate,
            estateTypes.estateWithoutExecutor,
            estateTypes.trust,
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
                data-testid="estate-type-radio-option"
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
  minorIncompetentTypes,
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
            minorIncompetentTypes.conservator,
            minorIncompetentTypes.guardian,
            minorIncompetentTypes.custodian,
            minorIncompetentTypes.nextFriendForMinor,
            minorIncompetentTypes.nextFriendForIncompetentPerson,
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
                data-testid="minor-incompetent-type-radio-option"
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
