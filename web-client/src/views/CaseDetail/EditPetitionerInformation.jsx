import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetailHeader';
import { Contacts } from '../StartCase/Contacts';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditPetitionerInformation = connect(
  {
    docketNumber: state.caseDetail.docketNumber,
    form: state.form,
    startCaseInternalHelper: state.startCaseInternalHelper,
    updateFormPartyTypeSequence: sequences.updateFormPartyTypeSequence,
    updatePetitionerInformationFormSequence:
      sequences.updatePetitionerInformationFormSequence,
    validatePetitionerInformationFormSequence:
      sequences.validatePetitionerInformationFormSequence,
    validationErrors: state.validationErrors,
  },
  ({
    docketNumber,
    form,
    startCaseInternalHelper,
    updateFormPartyTypeSequence,
    updatePetitionerInformationFormSequence,
    validatePetitionerInformationFormSequence,
    validationErrors,
  }) => {
    return (
      <>
        <CaseDetailHeader />

        <section
          className="usa-section grid-container"
          id="case-detail-internal"
        >
          <h1>Edit Petitioner Information</h1>
          <div className="blue-container margin-bottom-4">
            <h4>Party Information</h4>
            <FormGroup errorText={validationErrors.partyType}>
              <label className="usa-label" htmlFor="party-type">
                Party type
              </label>
              <select
                className="usa-select"
                id="party-type"
                name="partyType"
                value={form.partyType}
                onChange={e => {
                  updateFormPartyTypeSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validatePetitionerInformationFormSequence();
                }}
              >
                {Object.keys(startCaseInternalHelper.partyTypes).map(
                  partyType => (
                    <option
                      key={partyType}
                      value={startCaseInternalHelper.partyTypes[partyType]}
                    >
                      {startCaseInternalHelper.partyTypes[partyType]}
                    </option>
                  ),
                )}
              </select>
            </FormGroup>

            {(startCaseInternalHelper.showPrimaryContact ||
              startCaseInternalHelper.showSecondaryContact) && (
              <Contacts
                bind="form"
                contactsHelper="startCaseInternalContactsHelper"
                emailBind="form.contactPrimary"
                showPrimaryContact={startCaseInternalHelper.showPrimaryContact}
                showSecondaryContact={
                  startCaseInternalHelper.showSecondaryContact
                }
                wrapperClassName="contact-wrapper"
                onBlur="validatePetitionerInformationFormSequence"
                onChange="updateFormValueSequence"
              />
            )}
          </div>

          <Button
            onClick={() => {
              updatePetitionerInformationFormSequence();
            }}
          >
            Save
          </Button>

          <Button link href={`/case-detail/${docketNumber}/case-information`}>
            Cancel
          </Button>
        </section>
      </>
    );
  },
);
