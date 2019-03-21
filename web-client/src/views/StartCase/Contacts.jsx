import { connect } from '@cerebral/react';
import { props } from 'cerebral';
import React from 'react';

import { ContactPrimary } from './ContactPrimary';
import { ContactSecondary } from './ContactSecondary';

export const Contacts = connect(
  {
    bind: props.bind,
    contactsHelper: props.contactsHelper,
    emailBind: props.emailBind,
    onBlur: props.onBlur,
    onChange: props.onChange,
    parentView: props.parentView,
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
