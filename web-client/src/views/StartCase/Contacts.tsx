import { ContactPrimary } from './ContactPrimary';
import { ContactSecondary } from './ContactSecondary';
import { connect } from '@web-client/presenter/shared.cerebral';
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
    showSecondaryContact,
    useSameAsPrimary,
    wrapperClassName,
  }: {
    bind: string;
    contactsHelper: Record<string, any>;
    onBlur: () => void;
    onChange: string;
    parentView: string;
    showPrimaryContact: boolean;
    showSecondaryContact: boolean;
    useSameAsPrimary: boolean;
    wrapperClassName: string;
  }) {
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
