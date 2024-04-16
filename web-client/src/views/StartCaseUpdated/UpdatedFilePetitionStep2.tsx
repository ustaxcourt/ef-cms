import { Button } from '@web-client/ustc-ui/Button/Button';
import { ContactPrimaryUpdated } from '@web-client/views/StartCase/ContactPrimaryUpdated';
import { ContactSecondaryUpdated } from '@web-client/views/StartCase/ContactSecondaryUpdated';
import { ErrorNotification } from '@web-client/views/ErrorNotification';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { InfoNotificationComponent } from '@web-client/views/InfoNotification';
import { PETITION_TYPES } from '@web-client/presenter/actions/setupPetitionStateAction';
import { StateDrivenFileInput } from '@web-client/views/FileDocument/StateDrivenFileInput';
import { WarningNotificationComponent } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const UpdatedFilePetitionStep2 = connect(
  {
    constants: state.constants,
    form: state.form,
    resetSecondaryAddressSequence: sequences.resetSecondaryAddressSequence,
    updateFilingTypeSequence: sequences.updateFilingTypeSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updatedFilePetitionCompleteStep2Sequence:
      sequences.updatedFilePetitionCompleteStep2Sequence,
    updatedFilePetitionGoBackAStepSequence:
      sequences.updatedFilePetitionGoBackAStepSequence,
    updatedFilePetitionHelper: state.updatedFilePetitionHelper,
  },
  function UpdatedFilePetitionStep2({
    constants,
    form,
    resetSecondaryAddressSequence,
    updatedFilePetitionCompleteStep2Sequence,
    updatedFilePetitionGoBackAStepSequence,
    updatedFilePetitionHelper,
    updateFilingTypeSequence,
    updateFormValueSequence,
  }) {
    const showPlaceOfLegalResidence =
      form.petitionType === PETITION_TYPES.autoGenerated;

    return (
      <>
        <ErrorNotification />
        <p className="margin-bottom-3 margin-top-0 required-statement">
          *All fields required unless otherwise noted
        </p>
        <h2>I am filing this petition on behalf of...</h2>
        <fieldset className="usa-fieldset margin-bottom-2">
          {updatedFilePetitionHelper.filingOptions.map((filingType, index) => {
            return (
              <div className="usa-radio" key={filingType}>
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
                    // validateStartCaseWizardSequence
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
          })}{' '}
        </fieldset>
        {form.filingType === 'Myself' && (
          <ContactPrimaryUpdated
            bind="form"
            nameLabel="Full Name"
            showPlaceOfLegalResidence={showPlaceOfLegalResidence}
            onChange="updateFormValueSequence"
            // onBlur
          />
        )}
        {console.log('form', form)}
        {form.filingType === 'Myself and my spouse' && (
          <>
            <ContactPrimaryUpdated
              bind="form"
              nameLabel="Full Name"
              showPlaceOfLegalResidence={showPlaceOfLegalResidence}
              onChange="updateFormValueSequence"
            />
            <PetitionerAndSpouseInfo
              hasSpouseConsent={form.hasSpouseConsent}
              isSpouseDeceasedSelected={form.isSpouseDeceased}
              resetSecondaryAddressSequence={resetSecondaryAddressSequence}
              updateFilingTypeSequence={updateFilingTypeSequence}
              updateFormValueSequence={updateFormValueSequence}
            />
          </>
        )}
        {form.filingType === 'A business' && (
          <BusinessInfo
            businessFieldNames={updatedFilePetitionHelper.businessFieldNames}
            businessTypes={constants.BUSINESS_TYPES}
            maxFileSize={constants.MAX_FILE_SIZE_MB}
            selectedBusinessType={form.businessType}
            showPlaceOfLegalResidence={showPlaceOfLegalResidence}
            updateFilingTypeSequence={updateFilingTypeSequence}
          />
        )}
        {form.filingType === 'Other' && (
          <OtherInfo
            estateTypes={constants.ESTATE_TYPES}
            minorIncompetentTypes={constants.OTHER_TYPES}
            otherContactNameLabel={
              updatedFilePetitionHelper.otherContactNameLabel
            }
            selectedEstateType={form.estateType}
            selectedMinorIncompetentType={form.minorIncompetentType}
            selectedOtherType={form.otherType}
            showContactInformationForOtherPartyType={
              updatedFilePetitionHelper.showContactInformationForOtherPartyType
            }
            showPlaceOfLegalResidence={showPlaceOfLegalResidence}
            updateFilingTypeSequence={updateFilingTypeSequence}
          />
        )}

        <Button
          onClick={() => {
            updatedFilePetitionCompleteStep2Sequence();
          }}
        >
          Next
        </Button>
        <Button
          secondary
          onClick={() => {
            updatedFilePetitionGoBackAStepSequence();
          }}
        >
          Back
        </Button>
        <Button link onClick={() => console.log('Cancel')}>
          Cancel
        </Button>
      </>
    );
  },
);

function PetitionerAndSpouseInfo({
  hasSpouseConsent,
  isSpouseDeceasedSelected,
  resetSecondaryAddressSequence,
  updateFilingTypeSequence,
  updateFormValueSequence,
}) {
  return (
    <div
      className={classNames(
        'ustc-secondary-question',
        // validationErrors.partyType && 'usa-form-group--error',
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
              type="radio"
              value={isSpouseDeceased}
              onChange={e => {
                updateFilingTypeSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
                // validateStartCaseWizardSequence();
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
      </fieldset>
      {isSpouseDeceasedSelected === 'Yes' && <DeceasedSpouse />}
      {isSpouseDeceasedSelected === 'No' && (
        <Spouse
          hasSpouseConsent={hasSpouseConsent}
          resetSecondaryAddressSequence={resetSecondaryAddressSequence}
          updateFormValueSequence={updateFormValueSequence}
        />
      )}
    </div>
  );
}

function Spouse({
  hasSpouseConsent,
  resetSecondaryAddressSequence,
  updateFormValueSequence,
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
      <FormGroup>
        <input
          checked={hasSpouseConsent || false}
          className="usa-checkbox__input"
          id="spouse-consent"
          name="hasSpouseConsent"
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
        <label className="usa-checkbox__label" htmlFor="spouse-consent">
          {"I have my spouse's consent"}
        </label>
      </FormGroup>
      {hasSpouseConsent && (
        <ContactSecondaryUpdated
          bind="form"
          nameLabel="Full name of spouse"
          showPlaceOfLegalResidence={true}
          showSameAsPrimaryCheckbox={true}
          onChange="updateFormValueSequence"
        />
      )}
    </>
  );
}

function DeceasedSpouse() {
  return (
    <ContactSecondaryUpdated
      bind="form"
      displayInCareOf={true}
      nameLabel="Full name of deceased spouse"
      showPlaceOfLegalResidence={true}
      showSameAsPrimaryCheckbox={true}
      onChange="updateFormValueSequence"
    />
  );
}

function BusinessInfo({
  businessFieldNames,
  businessTypes,
  maxFileSize,
  selectedBusinessType,
  showPlaceOfLegalResidence,
  updateFilingTypeSequence,
}) {
  return (
    <div
      className={classNames(
        'ustc-secondary-question',
        // validationErrors.partyType && 'usa-form-group--error',
      )}
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
          <div className="usa-radio" key={businessType}>
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
                // validateStartCaseWizardSequence();
              }}
            />
            <label
              className="usa-radio__label"
              htmlFor={`businessType-${businessType}`}
              id={`is-business-type-${idx}`}
            >
              {businessType}
            </label>
          </div>
        ))}
      </fieldset>
      {selectedBusinessType && (
        <div>
          <ContactPrimaryUpdated
            bind="form"
            nameLabel={businessFieldNames.primary}
            secondaryLabel={businessFieldNames.secondary}
            secondaryLabelNote={businessFieldNames.secondaryNote}
            showPlaceOfLegalResidence={showPlaceOfLegalResidence}
            onChange="updateFormValueSequence"
          />
          <CorporateDisclosureUpload maxFileSize={maxFileSize} />
        </div>
      )}
    </div>
  );
}

function CorporateDisclosureUpload({ maxFileSize }) {
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
      <div className="margin-top-20">
        <FormGroup
        // errorText={
        // validationErrors.corporateDisclosureFile ||
        // validationErrors.corporateDisclosureFileSize
        // }
        >
          <label
            className={classNames(
              'ustc-upload-cds usa-label with-hint',
              // startCaseHelper.showCorporateDisclosureValid && 'validated',
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
            // updateFormValueSequence="updateStartCaseFormValueSequence"
            // validationSequence="validateStartCaseWizardSequence"
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
  selectedEstateType,
  selectedMinorIncompetentType,
  selectedOtherType,
  showContactInformationForOtherPartyType,
  showPlaceOfLegalResidence,
  updateFilingTypeSequence,
}) {
  return (
    <div
      className={classNames(
        'ustc-secondary-question',
        // validationErrors.partyType && 'usa-form-group--error',
      )}
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
          <div className="usa-radio" key={otherType}>
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
              htmlFor={`otherType-${otherType}`}
              id={`is-other-type-${idx}`}
            >
              {otherType}
            </label>
          </div>
        ))}
      </fieldset>
      {selectedOtherType === 'An estate or trust' && (
        <SecondaryEstateOptions
          estateTypes={estateTypes}
          selectedEstateType={selectedEstateType}
          updateFilingTypeSequence={updateFilingTypeSequence}
        />
      )}
      {selectedOtherType === 'A minor or legally incompetent person' && (
        <SecondaryMinorIncompetentOptions
          minorIncompetentTypes={minorIncompetentTypes}
          selectedMinorIncompetentType={selectedMinorIncompetentType}
          updateFilingTypeSequence={updateFilingTypeSequence}
        />
      )}
      {showContactInformationForOtherPartyType && (
        <OtherContactInformation
          otherContactNameLabel={otherContactNameLabel}
          showPlaceOfLegalResidence={showPlaceOfLegalResidence}
        />
      )}
    </div>
  );
}

function OtherContactInformation({
  otherContactNameLabel,
  showPlaceOfLegalResidence,
}) {
  return (
    <ContactPrimaryUpdated
      additionalLabel={otherContactNameLabel.additionalLabel}
      additionalLabelNote={otherContactNameLabel.additionalLabelNote}
      bind="form"
      nameLabel={otherContactNameLabel.primaryLabel}
      secondaryLabel={otherContactNameLabel.secondaryLabel}
      showPlaceOfLegalResidence={showPlaceOfLegalResidence}
      onChange="updateFormValueSequence"
    />
  );
}

function SecondaryEstateOptions({
  estateTypes,
  selectedEstateType,
  updateFilingTypeSequence,
}) {
  return (
    <div
      className={classNames(
        'ustc-secondary-question',
        // validationErrors.partyType && 'usa-form-group--error',
      )}
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
          <div className="usa-radio" key={estateType}>
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
                // validateStartCaseWizardSequence();
              }}
            />
            <label
              className="usa-radio__label"
              htmlFor={`estateType-${estateType}`}
              id={`is-estate-type-${idx}`}
            >
              {estateType}
            </label>
          </div>
        ))}
      </fieldset>
    </div>
  );
}

function SecondaryMinorIncompetentOptions({
  minorIncompetentTypes,
  selectedMinorIncompetentType,
  updateFilingTypeSequence,
}) {
  return (
    <div
      className={classNames(
        'ustc-secondary-question',
        // validationErrors.partyType && 'usa-form-group--error',
      )}
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
          <div className="usa-radio" key={minorIncompetentType}>
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
                // validateStartCaseWizardSequence();
              }}
            />
            <label
              className="usa-radio__label"
              htmlFor={`minorIncompetentType-${minorIncompetentType}`}
              id={`is-minorIncompetent-type-${idx}`}
            >
              {minorIncompetentType}
            </label>
          </div>
        ))}
      </fieldset>
    </div>
  );
}
