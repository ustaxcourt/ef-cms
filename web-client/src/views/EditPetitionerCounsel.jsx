import { AddressDisplay } from './CaseDetail/AddressDisplay';
import { Button } from '../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetail/CaseDetailHeader';
import { ErrorNotification } from './ErrorNotification';
import { FormCancelModalDialog } from './FormCancelModalDialog';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { MatchingEmailFoundModal } from './CaseDetail/MatchingEmailFoundModal';
import { NoMatchingEmailFoundModal } from './CaseDetail/NoMatchingEmailFoundModal';
import { RemovePetitionerCounselModal } from './CaseDetail/RemovePetitionerCounselModal';
import { ServiceIndicatorRadios } from './ServiceIndicatorRadios';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditPetitionerCounsel = connect(
  {
    caseDetail: state.caseDetail,
    editPetitionerInformationHelper: state.editPetitionerInformationHelper,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    openRemovePetitionerCounselModalSequence:
      sequences.openRemovePetitionerCounselModalSequence,
    screenMetadata: state.screenMetadata,
    showModal: state.modal.showModal,
    submitEditPetitionerCounselSequence:
      sequences.submitEditPetitionerCounselSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateEditPetitionerCounselSequence:
      sequences.validateEditPetitionerCounselSequence,
    validatePetitionerSequence: sequences.validatePetitionerSequence,
    validationErrors: state.validationErrors,
  },
  function EditPetitionerCounsel({
    caseDetail,
    form,
    formCancelToggleCancelSequence,
    openRemovePetitionerCounselModalSequence,
    showModal,
    submitEditPetitionerCounselSequence,
    updateFormValueSequence,
    validateEditPetitionerCounselSequence,
    validationErrors,
  }) {
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container">
          <ErrorNotification />

          <h2>Edit Petitioner Counsel</h2>

          <div className="blue-container margin-bottom-5">
            <div className="usa-form-group">
              <address aria-labelledby="practitioner-label">
                {form.name && (
                  <AddressDisplay
                    boldName
                    showEmail
                    contact={{
                      ...form,
                      ...form.contact,
                    }}
                    nameOverride={form.name}
                  />
                )}
              </address>

              <FormGroup
                className="margin-bottom-0"
                errorText={validationErrors && validationErrors.filers}
                id={'practitioner-representing'}
              >
                <fieldset className="usa-fieldset margin-bottom-0">
                  <legend
                    className="usa-legend"
                    id={'practitioner-representing-legend'}
                  >
                    Representing
                  </legend>

                  {caseDetail.petitioners.map(petitioner => (
                    <div className="usa-checkbox" key={petitioner.contactId}>
                      <input
                        aria-describedby="representing-legend"
                        checked={form.filersMap[petitioner.contactId] || false}
                        className="usa-checkbox__input"
                        id={`filing-${petitioner.contactId}`}
                        name={`filersMap.${petitioner.contactId}`}
                        type="checkbox"
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.checked,
                          });
                          validateEditPetitionerCounselSequence();
                        }}
                      />
                      <label
                        className="usa-checkbox__label  inline-block"
                        htmlFor={`filing-${petitioner.contactId}`}
                      >
                        {petitioner.name}
                      </label>
                    </div>
                  ))}
                </fieldset>
                <div className="margin-top-2">
                  <ServiceIndicatorRadios
                    bind={'form'}
                    getValidationError={() =>
                      validationErrors && validationErrors.serviceIndicator
                    }
                    validateSequence={validateEditPetitionerCounselSequence}
                  />
                </div>
              </FormGroup>
            </div>
          </div>

          <div>
            <Button
              id="submit-edit-petitioner-information"
              onClick={() => {
                submitEditPetitionerCounselSequence();
              }}
            >
              Save
            </Button>
            <Button
              link
              onClick={() => {
                formCancelToggleCancelSequence();
              }}
            >
              Cancel
            </Button>

            <Button
              link
              className="red-warning no-wrap float-right"
              icon="trash"
              id="remove-petitioner-btn"
              onClick={() => {
                openRemovePetitionerCounselModalSequence();
              }}
            >
              Remove petitioner counsel
            </Button>
          </div>
        </section>

        {showModal === 'FormCancelModalDialog' && (
          <FormCancelModalDialog onCancelSequence="closeModalAndReturnToCaseDetailSequence" />
        )}
        {showModal === 'MatchingEmailFoundModal' && <MatchingEmailFoundModal />}
        {showModal === 'NoMatchingEmailFoundModal' && (
          <NoMatchingEmailFoundModal />
        )}
        {showModal === 'RemovePetitionerCounselModal' && (
          <RemovePetitionerCounselModal />
        )}
      </>
    );
  },
);
