import { connect } from '@cerebral/react';
import { props } from 'cerebral';
import React from 'react';
import { ContactPrimary } from './ContactPrimary';
import { ContactSecondary } from './ContactSecondary';

export const Contacts = connect(
  {
    bind: props.bind,
    emailBind: props.emailBind,
    onChange: props.onChange,
    onBlur: props.onBlur,
    contactsHelper: props.contactsHelper,
    showPrimaryContact: props.showPrimaryContact,
    showSecondaryContact: props.showSecondaryContact,
  },
  ({
    bind,
    emailBind,
    onChange,
    onBlur,
    contactsHelper,
    showPrimaryContact,
    showSecondaryContact,
  }) => {
    return (
      <React.Fragment>
        {showPrimaryContact && (
          <ContactPrimary
            bind={bind}
            emailBind={emailBind}
            onChange={onChange}
            onBlur={onBlur}
            contactsHelper={contactsHelper}
          />
        )}
        {showSecondaryContact && (
          <ContactSecondary
            bind={bind}
            onChange={onChange}
            onBlur={onBlur}
            contactsHelper={contactsHelper}
          />
        )}
      </React.Fragment>
    );
  },
);
