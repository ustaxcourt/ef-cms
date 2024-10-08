import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React, { useState } from 'react';

type PractitionerLoginServiceEmailFormProps = {
  emailFormName: string;
};

const practitionerLoginServiceEmailFormDependencies = {
  createPractitionerUserHelper: state.createPractitionerUserHelper,
  form: state.form,
  updateFormValueSequence: sequences.updateFormValueSequence,
  validateEmailFormHelper: state.validateEmailFormHelper,
  validationErrors: state.validationErrors,
};

export const PractitionerLoginServiceEmailForm = connect<
  PractitionerLoginServiceEmailFormProps,
  typeof practitionerLoginServiceEmailFormDependencies
>(
  practitionerLoginServiceEmailFormDependencies,
  function PractitionerLoginServiceEmailForm({
    createPractitionerUserHelper,
    emailFormName,
    form,
    updateFormValueSequence,
    validateEmailFormHelper,
  }) {
    const [inFocusEmail, setInFocusEmail] = useState(true);
    const [inFocusConfirmEmail, setInFocusConfirmEmail] = useState(true);

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
                !inFocusEmail && validateEmailFormHelper.emailErrorMessage
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
                  setInFocusEmail(false);
                }}
                onChange={e =>
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  })
                }
                onFocus={() => setInFocusEmail(true)}
              />
            </FormGroup>
            <FormGroup
              errorText={
                !inFocusConfirmEmail &&
                validateEmailFormHelper.confirmEmailErrorMessage
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
                onBlur={() => setInFocusConfirmEmail(false)}
                onChange={e =>
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  })
                }
                onFocus={() => setInFocusConfirmEmail(true)}
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
