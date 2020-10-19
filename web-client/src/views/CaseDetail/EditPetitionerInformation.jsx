import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetailHeader';
import { Contacts } from '../StartCase/Contacts';
import { ErrorNotification } from '../ErrorNotification';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditPetitionerInformation = connect(
  {
    docketNumber: state.caseDetail.docketNumber,
    editPetitionerInformationHelper: state.editPetitionerInformationHelper,
    form: state.form,
    updateFormPartyTypeSequence: sequences.updateFormPartyTypeSequence,
    updatePetitionerInformationFormSequence:
      sequences.updatePetitionerInformationFormSequence,
    validatePetitionerInformationFormSequence:
      sequences.validatePetitionerInformationFormSequence,
    validationErrors: state.validationErrors,
  },
  function EditPetitionerInformation({
    docketNumber,
    editPetitionerInformationHelper,
    form,
    updateFormPartyTypeSequence,
    updatePetitionerInformationFormSequence,
    validatePetitionerInformationFormSequence,
    validationErrors,
  }) {
    return (
      <>
        <CaseDetailHeader />

        <section
          className="usa-section grid-container"
          id="case-detail-internal"
        >
          <ErrorNotification />

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
                {Object.keys(editPetitionerInformationHelper.partyTypes).map(
                  partyType => (
                    <option
                      key={partyType}
                      value={
                        editPetitionerInformationHelper.partyTypes[partyType]
                      }
                    >
                      {editPetitionerInformationHelper.partyTypes[partyType]}
                    </option>
                  ),
                )}
              </select>
            </FormGroup>

            {(editPetitionerInformationHelper.showPrimaryContact ||
              editPetitionerInformationHelper.showSecondaryContact) && (
              <>
                <Contacts
                  bind="form"
                  contactsHelper="startCaseInternalContactsHelper"
                  showPrimaryContact={
                    editPetitionerInformationHelper.showPrimaryContact
                  }
                  showPrimaryServiceIndicator={
                    editPetitionerInformationHelper.showPrimaryContact
                  }
                  showSecondaryContact={
                    editPetitionerInformationHelper.showSecondaryContact
                  }
                  showSecondaryServiceIndicator={
                    editPetitionerInformationHelper.showSecondaryContact
                  }
                  validateSequence={validatePetitionerInformationFormSequence}
                  wrapperClassName="contact-wrapper"
                  onBlur="validatePetitionerInformationFormSequence"
                  onChange="updateFormValueSequence"
                />
              </>
            )}
          </div>

          <Button
            id="submit-edit-petitioner-information"
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
