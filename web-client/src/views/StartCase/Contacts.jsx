import { ContactPrimary } from './ContactPrimary';
import { ContactSecondary } from './ContactSecondary';
import { EditPetitionerLoginForm } from '../EditPetitionerLoginForm';
import { ServiceIndicatorRadios } from '../ServiceIndicatorRadios';
import { WarningNotification } from '../WarningNotification';
import { connect } from '@cerebral/react';
import React from 'react';

export const Contacts = connect(
  {},
  function Contacts({
    bind,
    contactPrimaryDisplayEmail,
    contactPrimaryHasEmail,
    contactsHelper,
    onBlur,
    onChange,
    parentView,
    showEditEmail,
    showLoginAndServiceInformation,
    showPrimaryContact,
    showSecondaryContact,
    userPendingEmail,
    useSameAsPrimary,
    validateSequence,
    wrapperClassName,
  }) {
    return (
      <React.Fragment>
        {showPrimaryContact && (
          <>
            <ContactPrimary
              bind={bind}
              contactsHelper={contactsHelper}
              parentView={parentView}
              wrapperClassName={wrapperClassName}
              onBlur={onBlur}
              onChange={onChange}
            />
            {showLoginAndServiceInformation && (
              <>
                <h4>Login &amp; Service Information</h4>
                {userPendingEmail && (
                  <WarningNotification
                    alertWarning={{ message: 'Hi', title: 'Hello there' }}
                  />
                )}
                <div className="blue-container margin-bottom-6">
                  <ServiceIndicatorRadios
                    bind="form.contactPrimary"
                    hideElectronic={!contactPrimaryHasEmail}
                    validateSequence={validateSequence}
                    validationErrors="validationErrors.contactPrimary"
                  />
                  <div className="margin-top-4 margin-bottom-2">
                    {contactPrimaryHasEmail && (
                      <>
                        <label
                          className="usa-label"
                          htmlFor="current-email-display"
                        >
                          Current email address
                        </label>
                        <span id="current-email-display">
                          {contactPrimaryDisplayEmail}
                        </span>
                      </>
                    )}

                    {userPendingEmail && (
                      <>
                        <label
                          className="usa-label"
                          htmlFor="pending-email-display"
                        >
                          Pending email address
                        </label>
                        <span id="pending-email-display">
                          {userPendingEmail}
                        </span>
                      </>
                    )}

                    {!userPendingEmail &&
                      showEditEmail &&
                      !contactPrimaryHasEmail && (
                        <EditPetitionerLoginForm type="contactPrimary" />
                      )}
                  </div>
                </div>
              </>
            )}
          </>
        )}
        {showSecondaryContact && (
          <>
            <ContactSecondary
              bind={bind}
              contactsHelper={contactsHelper}
              parentView={parentView}
              useSameAsPrimary={useSameAsPrimary}
              wrapperClassName={wrapperClassName}
              onBlur={onBlur}
              onChange={onChange}
            />
          </>
        )}
      </React.Fragment>
    );
  },
);
