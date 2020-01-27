import { ContactPrimary } from './ContactPrimary';
import { ContactSecondary } from './ContactSecondary';
import { ServiceIndicatorRadios } from '../ServiceIndicatorRadios';
import { connect } from '@cerebral/react';
import { props } from 'cerebral';
import React from 'react';

export const Contacts = connect(
  {
    ...props,
  },
  ({
    bind,
    contactsHelper,
    emailBind,
    onBlur,
    onChange,
    parentView,
    showPrimaryContact,
    showPrimaryServiceIndicator,
    showSecondaryContact,
    showSecondaryServiceIndicator,
    wrapperClassName,
  }) => {
    return (
      <React.Fragment>
        {showPrimaryContact && (
          <>
            <ContactPrimary
              bind={bind}
              contactsHelper={contactsHelper}
              emailBind={emailBind}
              parentView={parentView}
              wrapperClassName={wrapperClassName}
              onBlur={onBlur}
              onChange={onChange}
            />
            {showPrimaryServiceIndicator && (
              <>
                <h4 className="margin-top-6">Service Information</h4>
                <ServiceIndicatorRadios
                  bind="form.contactPrimary"
                  validationErrors="validationErrors"
                />
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
              wrapperClassName={wrapperClassName}
              onBlur={onBlur}
              onChange={onChange}
            />
            {showSecondaryServiceIndicator && (
              <>
                <h4 className="margin-top-6">Service Information</h4>
                <ServiceIndicatorRadios
                  bind="form.contactSecondary"
                  validationErrors="validationErrors"
                />
              </>
            )}
          </>
        )}
      </React.Fragment>
    );
  },
);
