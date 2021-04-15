import { Address } from './StartCase/Address';
import { Button } from '../ustc-ui/Button/Button';
import { CaseDetailHeader } from './CaseDetail/CaseDetailHeader';
import { Country } from './StartCase/Country';
import { ErrorNotification } from './ErrorNotification';
import { FormCancelModalDialog } from './FormCancelModalDialog';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { InternationalAddress } from './StartCase/InternationalAddress';
import { MatchingEmailFoundModal } from './CaseDetail/MatchingEmailFoundModal';
import { NoMatchingEmailFoundModal } from './CaseDetail/NoMatchingEmailFoundModal';
import { ServiceIndicatorRadios } from './ServiceIndicatorRadios';
import { WarningNotificationComponent } from './WarningNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const EditPetitionerInformationInternal = connect(
  {
    COUNTRY_TYPES: state.constants.COUNTRY_TYPES,
    editPetitionerInformationHelper: state.editPetitionerInformationHelper,
    form: state.form,
    formCancelToggleCancelSequence: sequences.formCancelToggleCancelSequence,
    screenMetadata: state.screenMetadata,
    showModal: state.modal.showModal,
    submitEditPetitionerSequence: sequences.submitEditPetitionerSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validatePetitionerSequence: sequences.validatePetitionerSequence,
    validationErrors: state.validationErrors,
  },
  function EditPetitionerInformationInternal({
    COUNTRY_TYPES,
    editPetitionerInformationHelper,
    form,
    formCancelToggleCancelSequence,
    screenMetadata,
    showModal,
    submitEditPetitionerSequence,
    updateFormValueSequence,
    validatePetitionerSequence,
    validationErrors,
  }) {
    const type = 'contact';
    const bind = 'form';
    const onBlur = 'validatePetitionerSequence';

    return (
      <>
        <CaseDetailHeader />

        <section className="usa-section grid-container">
          <ErrorNotification />

          <h2>Edit Petitioner Information</h2>

          <h3>Contact Information</h3>

          <div className="blue-container margin-bottom-5">
            <div className="usa-form-group">
              <FormGroup errorText={validationErrors.contact?.name}>
                <label className="usa-label" htmlFor="name">
                  <span>Name</span>
                </label>
                <input
                  autoCapitalize="none"
                  className="usa-input"
                  id="name"
                  name="contact.name"
                  type="text"
                  value={form.contact.name || ''}
                  onBlur={() => {
                    validatePetitionerSequence();
                  }}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </FormGroup>
            </div>

            <FormGroup errorText={validationErrors.contact?.additionalName}>
              <label className="usa-label" htmlFor="additionalName">
                <span>
                  Additional name <span className="usa-hint">(optional)</span>
                </span>
                <p className="usa-hint">
                  A representative of the taxpayer or petitioner (In Care Of,
                  Guardian, Executor, Trustee, Surviving Spouse, etc.)
                </p>
              </label>
              <input
                autoCapitalize="none"
                className="usa-input"
                id="additionalName"
                name="contact.additionalName"
                type="text"
                value={form.contact.additionalName || ''}
                onBlur={() => {
                  validatePetitionerSequence();
                }}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>

            <Country
              bind={bind}
              clearTypeOnCountryChange={true}
              type={type}
              onChange="updateFormValueSequence"
            />
            {form.contact.countryType === COUNTRY_TYPES.DOMESTIC ? (
              <Address
                bind={bind}
                type={type}
                onBlur={onBlur}
                onChange="updateFormValueSequence"
              />
            ) : (
              <InternationalAddress
                bind={bind}
                type={type}
                onBlur={onBlur}
                onChange="updateFormValueSequence"
              />
            )}
            <FormGroup
              errorText={
                validationErrors &&
                validationErrors.contact &&
                validationErrors.contact.phone
              }
            >
              <label className="usa-label" htmlFor="phone">
                Phone number
              </label>
              <span className="usa-hint">
                If you do not have a current phone number, enter N/A.
              </span>
              <input
                autoCapitalize="none"
                className="usa-input max-width-200"
                id="phone"
                name="contact.phone"
                type="tel"
                value={form.contact.phone || ''}
                onBlur={() => {
                  validatePetitionerSequence();
                }}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>
          </div>

          <h3>Login & Service Information</h3>
          {screenMetadata.userPendingEmail && (
            <WarningNotificationComponent
              alertWarning={{
                title: `${screenMetadata.userPendingEmail} is not verified. When petitioner verifies email, service will update to electronic at the verified email address.`,
              }}
              dismissable={false}
              scrollToTop={false}
            />
          )}
          <div className="blue-container margin-bottom-5">
            <div className="margin-bottom-6">
              <ServiceIndicatorRadios
                bind="form.contact"
                hideElectronic={!form.contact.currentEmail}
                validateSequence={validatePetitionerSequence}
                validationErrors="validationErrors.contact"
              />
            </div>
            {form.contact.currentEmail && (
              <div className="margin-bottom-6">
                <label className="usa-label" htmlFor="current-email-display">
                  Current email address
                </label>
                <span id="current-email-display">
                  {form.contact.currentEmail}
                </span>
              </div>
            )}

            {editPetitionerInformationHelper.userPendingEmail && (
              <>
                <label className="usa-label" htmlFor="pending-email-display">
                  Pending email address
                </label>
                <span id="pending-email-display">
                  {editPetitionerInformationHelper.userPendingEmail}
                </span>
              </>
            )}

            {editPetitionerInformationHelper.showEditEmail &&
              !form.contact.currentEmail && (
                <>
                  <h4>Add Login & Service Email</h4>
                  <FormGroup
                    errorText={
                      validationErrors.contact && validationErrors.contact.email
                    }
                  >
                    <label className="usa-label" htmlFor="updatedEmail">
                      New email address
                    </label>
                    <input
                      autoCapitalize="none"
                      className="usa-input"
                      id="updatedEmail"
                      name="contact.updatedEmail"
                      type="text"
                      value={form.contact.updatedEmail || ''}
                      onBlur={() => validatePetitionerSequence()}
                      onChange={e =>
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                  <FormGroup
                    errorText={
                      validationErrors.contact &&
                      validationErrors.contact.confirmEmail
                    }
                  >
                    <label className="usa-label" htmlFor="confirm-email">
                      Re-enter new email address
                    </label>
                    <input
                      autoCapitalize="none"
                      className="usa-input"
                      id="confirm-email"
                      name="contact.confirmEmail"
                      type="text"
                      value={form.contact.confirmEmail || ''}
                      onBlur={() => validatePetitionerSequence()}
                      onChange={e =>
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        })
                      }
                    />
                  </FormGroup>
                </>
              )}
          </div>

          <Button
            id="submit-edit-petitioner-information"
            onClick={() => {
              submitEditPetitionerSequence();
            }}
          >
            Save
          </Button>
          <Button
            link
            onClick={() => {
              formCancelToggleCancelSequence();
              return false;
            }}
          >
            Cancel
          </Button>
        </section>

        {showModal === 'FormCancelModalDialog' && (
          <FormCancelModalDialog onCancelSequence="closeModalAndReturnToCaseDetailSequence" />
        )}
        {showModal === 'MatchingEmailFoundModal' && <MatchingEmailFoundModal />}
        {showModal === 'NoMatchingEmailFoundModal' && (
          <NoMatchingEmailFoundModal />
        )}
      </>
    );
  },
);
