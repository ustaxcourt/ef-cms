import { AddressDisplay } from './CaseDetail/AddressDisplay';
import { Button } from '../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetail/CaseDetailHeader';
import { ErrorNotification } from './ErrorNotification';
import { FormCancelModalDialog } from './FormCancelModalDialog';
import { MatchingEmailFoundModal } from './CaseDetail/MatchingEmailFoundModal';
import { NoMatchingEmailFoundModal } from './CaseDetail/NoMatchingEmailFoundModal';
import { RemovePetitionerCounselModal } from './CaseDetail/RemovePetitionerCounselModal';
import { ServiceIndicatorRadios } from './ServiceIndicatorRadios';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

/**
 * mob timer stop notes, jojo:
 * - rename/reuse submitEditIrsPractitionersSequence -> submitEditRespondentCounselSequence
 * - refactor validateEditRespondentCounselSequence and action to use one respondent
 * - note the possibility to rename to EditIrsPractitionersFactory entity as well
 */

export const EditRespondentCounsel = connect(
  {
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    openRemoveRespondentCounselModalSequence:
      sequences.openRemoveRespondentCounselModalSequence,
    screenMetadata: state.screenMetadata,
    showModal: state.modal.showModal,
    submitEditRespondentCounselSequence:
      sequences.submitEditRespondentCounselSequence,
    validateEditRespondentCounselSequence:
      sequences.validateEditRespondentCounselSequence,
    validatePetitionerSequence: sequences.validatePetitionerSequence,
    validationErrors: state.validationErrors,
  },
  function EditPetitionerCounsel({
    form,
    formCancelToggleCancelSequence,
    openRemoveRespondentCounselModalSequence,
    showModal,
    submitEditRespondentCounselSequence,
    validateEditRespondentCounselSequence,
    validationErrors,
  }) {
    return (
      <>
        <CaseDetailHeader />
        <section className="usa-section grid-container">
          <ErrorNotification />

          <h2>Edit Respondent Counsel</h2>

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

              <div className="margin-top-2">
                <ServiceIndicatorRadios
                  bind={'form'}
                  getValidationError={() =>
                    validationErrors && validationErrors.serviceIndicator
                  }
                  validateSequence={validateEditRespondentCounselSequence}
                />
              </div>
            </div>
          </div>

          <div>
            <Button
              id="submit-edit-respondent-information"
              onClick={() => {
                submitEditRespondentCounselSequence();
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
              id="remove-respondence-btn"
              onClick={() => {
                openRemoveRespondentCounselModalSequence();
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
