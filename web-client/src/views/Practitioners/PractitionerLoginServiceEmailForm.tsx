import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

type PractitionerLoginServiceEmailFormProps = {
  emailFormName: string;
};

const practitionerLoginServiceEmailFormDependencies = {
  createPractitionerUserHelper: state.createPractitionerUserHelper,
  emailConfirmationFormHelper: state.emailConfirmationFormHelper,
  form: state.form,
  updateEmailConfirmationFormSequence:
    sequences.updateEmailConfirmationFormSequence,
  updateFormValueSequence: sequences.updateFormValueSequence,
  validationErrors: state.validationErrors,
};

export const PractitionerLoginServiceEmailForm = connect<
  PractitionerLoginServiceEmailFormProps,
  typeof practitionerLoginServiceEmailFormDependencies
>(
  practitionerLoginServiceEmailFormDependencies,
  function PractitionerLoginServiceEmailForm({
    createPractitionerUserHelper,
    emailConfirmationFormHelper,
    emailFormName,
    form,
    updateEmailConfirmationFormSequence,
    updateFormValueSequence,
  }) {
    return (
      <div className="margin-bottom-4">
        <h2>Login & Service Email</h2>
        <div className="blue-container">
          <div className="grid-row margin-bottom-6">
            <div className="desktop:grid-col-3">
              <p className="usa-label margin-bottom-05">
                Current email address
              </p>
              {createPractitionerUserHelper.formattedOriginalEmail}
            </div>
            {form.pendingEmail && (
              <div className="desktop:grid-col-3 padding-top-2 desktop:padding-top-0">
                <p className="usa-label margin-bottom-05">
                  Pending email address
                </p>
                {form.pendingEmail}
              </div>
            )}
          </div>
          <div>
            <h4>Change Login & Service Email</h4>
            <FormGroup
              errorText={
                emailConfirmationFormHelper.showEmailErrorMessage &&
                emailConfirmationFormHelper.emailErrorMessage
              }
            >
              <label className="usa-label" htmlFor="updatedEmail">
                New email address
              </label>
              <input
                aria-label={emailFormName}
                autoCapitalize="none"
                className="usa-input"
                data-testid="practitioner-email-input"
                id={emailFormName}
                name={emailFormName}
                type="text"
                value={form[emailFormName] || ''}
                onBlur={() => {
                  updateEmailConfirmationFormSequence({
                    field: emailFormName,
                    inFocus: false,
                  });
                }}
                onChange={e =>
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  })
                }
                onFocus={() =>
                  updateEmailConfirmationFormSequence({
                    field: emailFormName,
                    inFocus: true,
                  })
                }
              />
            </FormGroup>
            <FormGroup
              errorText={
                emailConfirmationFormHelper.showConfirmEmailErrorMessage &&
                emailConfirmationFormHelper.confirmEmailErrorMessage
              }
            >
              <label className="usa-label" htmlFor="confirm-email">
                Re-enter new email address
              </label>
              <input
                aria-label="confirmEmail"
                autoCapitalize="none"
                className="usa-input"
                data-testid="practitioner-confirm-email-input"
                id="confirm-email"
                name="confirmEmail"
                type="text"
                value={form.confirmEmail || ''}
                onBlur={() =>
                  updateEmailConfirmationFormSequence({
                    field: 'confirmEmail',
                    inFocus: false,
                  })
                }
                onChange={e =>
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  })
                }
                onFocus={() =>
                  updateEmailConfirmationFormSequence({
                    field: 'confirmEmail',
                    inFocus: true,
                  })
                }
              />
            </FormGroup>
          </div>
        </div>
      </div>
    );
  },
);

PractitionerLoginServiceEmailForm.displayName =
  'PractitionerLoginServiceEmailForm';
