import { Button } from '../../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetailHeader';
import { Contacts } from '../StartCase/Contacts';
import { ErrorNotification } from '../ErrorNotification';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { MatchingEmailFoundModal } from './MatchingEmailFoundModal';
import { NoMatchingEmailFoundModal } from './NoMatchingEmailFoundModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditPetitionerInformation = connect(
  {
    docketNumber: state.caseDetail.docketNumber,
    editPetitionerInformationHelper: state.editPetitionerInformationHelper,
    form: state.form,
    showModal: state.modal.showModal,
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
    showModal,
    updateFormPartyTypeSequence,
    updatePetitionerInformationFormSequence,
    validatePetitionerInformationFormSequence,
    validationErrors,
  }) {
    return (
      <>
        {showModal === 'MatchingEmailFoundModal' && <MatchingEmailFoundModal />}
        {showModal === 'NoMatchingEmailFoundModal' && (
          <NoMatchingEmailFoundModal />
        )}
        <CaseDetailHeader />

        <section
          className="usa-section grid-container"
          id="case-detail-internal"
        >
          <ErrorNotification />

          <h1>Edit Petitioner Information</h1>
          <div className="margin-bottom-4">
            <h4>Party Information</h4>
            <div className="blue-container margin-bottom-4">
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
            </div>

            {(editPetitionerInformationHelper.showPrimaryContact ||
              editPetitionerInformationHelper.showSecondaryContact) && (
              <>
                <Contacts
                  bind="form"
                  contactPrimaryDisplayEmail={form.contactPrimary.email}
                  contactPrimaryHasEmail={
                    editPetitionerInformationHelper.contactPrimaryHasEmail
                  }
                  contactPrimaryHasVerifiedEmail={
                    editPetitionerInformationHelper.contactPrimaryHasVerifiedEmail
                  }
                  contactsHelper="startCaseInternalContactsHelper"
                  showEditEmail={editPetitionerInformationHelper.showEditEmail}
                  showLoginAndServiceInformation={true}
                  showPrimaryContact={
                    editPetitionerInformationHelper.showPrimaryContact
                  }
                  showSecondaryContact={
                    editPetitionerInformationHelper.showSecondaryContact
                  }
                  userPendingEmail={
                    editPetitionerInformationHelper.userPendingEmail
                  }
                  validateSequence={validatePetitionerInformationFormSequence}
                  wrapperClassName="contact-wrapper blue-container margin-bottom-4"
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
