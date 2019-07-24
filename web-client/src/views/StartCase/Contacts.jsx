import { ContactPrimary } from './ContactPrimary';
import { ContactSecondary } from './ContactSecondary';
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
    showSecondaryContact,
  }) => {
    return (
      <React.Fragment>
        {showPrimaryContact && (
          <ContactPrimary
            bind={bind}
            contactsHelper={contactsHelper}
            emailBind={emailBind}
            parentView={parentView}
            onBlur={onBlur}
            onChange={onChange}
          />
        )}
        {showSecondaryContact && (
          <ContactSecondary
            bind={bind}
            contactsHelper={contactsHelper}
            parentView={parentView}
            onBlur={onBlur}
            onChange={onChange}
          />
        )}
      </React.Fragment>
    );
  },
);
