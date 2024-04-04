import { Contacts } from '@web-client/views/StartCase/Contacts';
import { ErrorNotification } from '@web-client/views/ErrorNotification';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const UpdatedFilePetitionStep2 = connect(
  {
    form: state.form,
    updateStartCaseFormValueSequence:
      sequences.updateStartCaseFormValueSequence,
    updatedFilePetitionHelper: state.updatedFilePetitionHelper,
  },
  function UpdatedFilePetitionStep2({
    form,
    updatedFilePetitionHelper,
    updateStartCaseFormValueSequence,
  }) {
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
                    updateStartCaseFormValueSequence({
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
          <Contacts
            bind="form"
            contactsHelper="contactsHelper"
            parentView="StartCase"
            showPrimaryContact={true}
            showSecondaryContact={false}
            wrapperClassName={'-'}
            onChange="updateFormValueSequence"
            // showPrimaryContact={startCaseHelper.showPrimaryContact}
            // showSecondaryContact={startCaseHelper.showSecondaryContact}
            // useSameAsPrimary={true}
            // onBlur="validateStartCaseWizardSequence"
          />
        )}
        {form.filingType === 'myselfAndMySpouse' && (
          <PetitionerAndSpouseInfo filingOption={form.filingType} />
        )}
        {form.filingType === 'aBusiness' && (
          <BusinessInfo filingOption={form.filingType} />
        )}
        {form.filingType === 'other' && (
          <OtherInfo filingOption={form.filingType} />
        )}
      </>
    );
  },
);

function PetitionerAndSpouseInfo({ filingOption }) {
  return <div>{filingOption}</div>;
}

function BusinessInfo({ filingOption }) {
  return <div>{filingOption}</div>;
}

function OtherInfo({ filingOption }) {
  return <div>{filingOption}</div>;
}
