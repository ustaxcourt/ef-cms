import { ContactPrimary } from './ContactPrimary';
import { ContactSecondary } from './ContactSecondary';
import { EditPetitionerLoginForm } from '../EditPetitionerLoginForm';
import { ServiceIndicatorRadios } from '../ServiceIndicatorRadios';
import { connect } from '@cerebral/react';
import { props, state } from 'cerebral';
import React from 'react';

export const Contacts = connect(
  {
    helper: state[props.contactsHelper],
  },
  function Contacts({
    bind,
    contactsHelper,
    helper,
    onBlur,
    onChange,
    parentView,
    showLoginAndServiceInformation,
    showPrimaryContact,
    showSecondaryContact,
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
                <div className="blue-container margin-bottom-6">
                  <ServiceIndicatorRadios
                    bind="form.contactPrimary"
                    isElectronicAvailable={
                      helper.isElectronicAvailableForPrimary
                    }
                    validateSequence={validateSequence}
                    validationErrors="validationErrors.contactPrimary"
                  />
                  <div className="margin-top-4">
                    <EditPetitionerLoginForm type="contactPrimary" />
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
            {showLoginAndServiceInformation && (
              <>
                <h4>Login &amp; Service Information</h4>
                <div className="blue-container margin-bottom-6">
                  <ServiceIndicatorRadios
                    bind="form.contactSecondary"
                    isElectronicAvailable={
                      helper.isElectronicAvailableForSecondary
                    }
                    validateSequence={validateSequence}
                    validationErrors="validationErrors.contactSecondary"
                  />
                  <div className="margin-top-4">
                    <EditPetitionerLoginForm type="contactSecondary" />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </React.Fragment>
    );
  },
);
