import { Button } from '@web-client/ustc-ui/Button/Button';
import { ContactPrimaryUpdated } from '@web-client/views/StartCase/ContactPrimaryUpdated';
import { ContactSecondaryUpdated } from '@web-client/views/StartCase/ContactSecondaryUpdated';
import { ErrorNotification } from '@web-client/views/ErrorNotification';
import { FormGroup } from '@web-client/ustc-ui/FormGroup/FormGroup';
import { PETITION_TYPES } from '@web-client/presenter/actions/setupPetitionStateAction';
import { WarningNotificationComponent } from '@web-client/views/WarningNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const UpdatedFilePetitionStep2 = connect(
  {
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
        {form.filingType === 'aBusiness' && (
          <BusinessInfo filingOption={form.filingType} />
        )}
        {form.filingType === 'other' && (
          <OtherInfo filingOption={form.filingType} />
        )}

        <Button
          onClick={() => {
            console.log('complete step 2');
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

function BusinessInfo({ filingOption }) {
  return <div>{filingOption}</div>;
}

function OtherInfo({ filingOption }) {
  return <div>{filingOption}</div>;
}
