import { ContactPrimary } from './ContactPrimary';
import { ContactSecondary } from './ContactSecondary';
import { EditPetitionerLoginForm } from '../EditPetitionerLoginForm';
import { ServiceIndicatorRadios } from '../ServiceIndicatorRadios';
import { connect } from '@cerebral/react';
import React from 'react';

export const Contacts = connect(
  {},
  function Contacts({
    bind,
    contactsHelper,
    onBlur,
    onChange,
    parentView,
    showPrimaryContact,
    showPrimaryServiceIndicator,
    showSecondaryContact,
    showSecondaryServiceIndicator,
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
            {showPrimaryServiceIndicator && (
              <>
                <h4>Login &amp; Service Information</h4>
                <div className="blue-container margin-bottom-6">
                  <ServiceIndicatorRadios
                    bind="form.contactPrimary"
                    validateSequence={validateSequence}
                    validationErrors="validationErrors.contactPrimary"
                  />
                  <EditPetitionerLoginForm type="contactPrimary" />
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
            {showSecondaryServiceIndicator && (
              <>
                <h4>Login &amp; Service Information</h4>
                <div className="blue-container margin-bottom-6">
                  <ServiceIndicatorRadios
                    bind="form.contactSecondary"
                    validateSequence={validateSequence}
                    validationErrors="validationErrors.contactSecondary"
                  />
                  <EditPetitionerLoginForm type="contactSecondary" />
                </div>
              </>
            )}
          </>
        )}
      </React.Fragment>
    );
  },
);
