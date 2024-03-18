import { BigHeader } from './BigHeader';
import { Button } from '../ustc-ui/Button/Button';
import { ErrorNotification } from './ErrorNotification';
import { FormGroup } from '../ustc-ui/FormGroup/FormGroup';
import { VerifyNewEmailModal } from './MyAccount/VerifyNewEmailModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const ChangeLoginAndServiceEmail = connect(
  {
    form: state.form,
    navigateToPathSequence: sequences.navigateToPathSequence,
    showModal: state.modal.showModal,
    submitChangeLoginAndServiceEmailSequence:
      sequences.submitChangeLoginAndServiceEmailSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    user: state.user,
    validateChangeLoginAndServiceEmailSequence:
      sequences.validateChangeLoginAndServiceEmailSequence,
    validationErrors: state.validationErrors,
  },
  function ChangeLoginAndServiceEmail({
    form,
    navigateToPathSequence,
    showModal,
    submitChangeLoginAndServiceEmailSequence,
    updateFormValueSequence,
    user,
    validateChangeLoginAndServiceEmailSequence,
    validationErrors,
  }) {
    return (
      <React.Fragment>
        <BigHeader text={'Change Login & Service Email Address'} />
        <section className="usa-section grid-container">
          <ErrorNotification />

          <p>
            This is the email you will use to log in to the system and where you
            will receive service.
          </p>

          <div className="blue-container margin-bottom-5">
            <div className="grid-row margin-bottom-6">
              <div className="desktop:grid-col-3">
                <p className="usa-label margin-bottom-05">
                  Current email address
                </p>
                {user.email}
              </div>
              {user.pendingEmail && (
                <div className="desktop:grid-col-3 padding-top-2 desktop:padding-top-0">
                  <p className="usa-label margin-bottom-05">
                    Pending email address
                  </p>
                  {user.pendingEmail}
                </div>
              )}
            </div>
            <div>
              <h4>Change Login & Service Email</h4>
              <FormGroup errorText={validationErrors.email}>
                <label className="usa-label" htmlFor="email">
                  New email address
                </label>
                <input
                  autoCapitalize="none"
                  className="usa-input"
                  data-testid="change-login-email-input"
                  id="email"
                  name="email"
                  type="text"
                  value={form.email || ''}
                  onBlur={() => validateChangeLoginAndServiceEmailSequence()}
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
                  autoCapitalize="none"
                  className="usa-input"
                  data-testid="confirm-change-login-email-input"
                  id="confirm-email"
                  name="confirmEmail"
                  type="text"
                  value={form.confirmEmail || ''}
                  onBlur={() => validateChangeLoginAndServiceEmailSequence()}
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
          <div className="grid-row margin-bottom-6">
            <div className="grid-col-12">
              <Button
                data-testid="save-change-login-email-button"
                onClick={() => submitChangeLoginAndServiceEmailSequence()}
              >
                Save
              </Button>
              <Button
                link
                onClick={() => navigateToPathSequence({ path: '/my-account' })}
              >
                Cancel
              </Button>
            </div>
          </div>
        </section>

        {showModal === 'VerifyNewEmailModal' && <VerifyNewEmailModal />}
      </React.Fragment>
    );
  },
);

ChangeLoginAndServiceEmail.displayName = 'ChangeLoginAndServiceEmail';
