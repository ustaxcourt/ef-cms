import { ContactPrimary } from './ContactPrimary';
import { ContactSecondary } from './ContactSecondary';
import { props as cerebralProps, sequences } from 'cerebral';
import { connect } from '@web-client/presenter/shared.cerebral';
import React from 'react';

const props = cerebralProps as unknown as {
  contactsHelper: string;
  bind: string;
  onBlur: Function;
  onChange: Function;
  parentView: string;
};

export const Contacts = connect(
  {
    bind: props.bind,
    onBlur: props.onBlur,
    onChange: props.onChange,
  },
  function Contacts({
    bind,
    contactsHelper,
    onBlur,
    onChange,
    parentView,
    showPrimaryContact,
    showSecondaryContact,
    useSameAsPrimary,
    wrapperClassName,
  }) {
    console.log('sequences: ', sequences);
    console.log('onchange: ', onChange);
    return (
      <>
        {showPrimaryContact && (
          <ContactPrimary
            bind={bind}
            contactsHelper={contactsHelper}
            parentView={parentView}
            wrapperClassName={wrapperClassName}
            onBlur={onBlur}
            onChange={onChange}
          />
        )}
        {showSecondaryContact && (
          <ContactSecondary
            bind={bind}
            contactsHelper={contactsHelper}
            parentView={parentView}
            useSameAsPrimary={useSameAsPrimary}
            wrapperClassName={wrapperClassName}
            onBlur={onBlur}
            onChange={onChange}
          />
        )}
      </>
    );
  },
);

Contacts.displayName = 'Contacts';
