import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';

export const PractitionerLoginServiceEmailForm = connect(
  {
    createPractitionerUserHelper: state.createPractitionerUserHelper,
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateSequence: sequences[props.validateSequenceName],
    validationErrors: state.validationErrors,
  },
  function PractitionerLoginServiceEmailForm({
    createPractitionerUserHelper,
    emailFormName,
    form,
    updateFormValueSequence,
    validateSequence,
    validationErrors,
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
                validationErrors.updatedEmail || validationErrors.email
              }
            >
              <label className="usa-label" htmlFor="updatedEmail">
                New email address
              </label>
              <input
                aria-label={emailFormName}
                autoCapitalize="none"
                className="usa-input"
                id={emailFormName}
                name={emailFormName}
                type="text"
                value={form[emailFormName] || ''}
                onBlur={() => validateSequence()}
                onChange={e =>
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  })
                }
              />
            </FormGroup>
            <FormGroup errorText={validationErrors.confirmEmail}>
              <label className="usa-label" htmlFor="confirm-email">
                Re-enter new email address
              </label>
              <input
                aria-label="confirmEmail"
                autoCapitalize="none"
                className="usa-input"
                id="confirm-email"
                name="confirmEmail"
                type="text"
                value={form.confirmEmail || ''}
                onBlur={() => validateSequence()}
                onChange={e =>
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
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
