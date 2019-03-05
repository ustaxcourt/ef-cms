import { connect } from '@cerebral/react';
import { props } from 'cerebral';
import React from 'react';
import { ContactPrimary } from './ContactPrimary';
import { ContactSecondary } from './ContactSecondary';

export const Contacts = connect(
  {
    parentView: props.parentView,
    bind: props.bind,
    emailBind: props.emailBind,
    onChange: props.onChange,
    onBlur: props.onBlur,
    contactsHelper: props.contactsHelper,
    showPrimaryContact: props.showPrimaryContact,
    showSecondaryContact: props.showSecondaryContact,
  },
  ({
    parentView,
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
            parentView={parentView}
            bind={bind}
            emailBind={emailBind}
            onChange={onChange}
            onBlur={onBlur}
            contactsHelper={contactsHelper}
          />
        )}
        {showSecondaryContact && (
          <ContactSecondary
            parentView={parentView}
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
