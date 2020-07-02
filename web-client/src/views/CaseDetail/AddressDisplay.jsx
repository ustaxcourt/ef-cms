import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { props, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const AddressDisplay = connect(
  {
    constants: state.constants,
    contact: props.contact,
    nameOverride: props.nameOverride || {},
    noMargin: props.noMargin || false,
    showEmail: props.showEmail || false,
  },
  function AddressDisplay({
    constants,
    contact,
    nameOverride,
    noMargin,
    showEmail,
  }) {
    return (
      <>
        <p
          className={classNames(
            noMargin ? 'no-margin' : 'margin-top-0',
            'address-name',
          )}
        >
          {nameOverride || contact.name}{' '}
          {contact.barNumber && `(${contact.barNumber})`}
          {contact.inCareOf && (
            <span>
              <br />
              c/o {contact.inCareOf}
            </span>
          )}
        </p>
        <p className={classNames(noMargin && 'no-margin')}>
          <span className="address-line">{contact.address1}</span>
          {contact.address2 && (
            <span className="address-line">{contact.address2}</span>
          )}
          {contact.address3 && (
            <span className="address-line">{contact.address3}</span>
          )}
          <span className="address-line">
            {contact.city && `${contact.city}, `}
            {contact.state} {contact.postalCode}
          </span>
          {contact.countryType === constants.COUNTRY_TYPES.INTERNATIONAL && (
            <span className="address-line">{contact.country}</span>
          )}
          {contact.phone && (
            <span
              className={classNames(
                noMargin ? 'no-margin' : 'margin-top-1',
                'address-line',
              )}
            >
              {contact.phone}
            </span>
          )}
          {contact.email && showEmail && (
            <span className="address-line">
              {contact.email}
              {contact.hasEAccess && (
                <FontAwesomeIcon
                  className="margin-left-05 fa-icon-blue"
                  icon="flag"
                  size="1x"
                />
              )}
            </span>
          )}
        </p>
      </>
    );
  },
);
