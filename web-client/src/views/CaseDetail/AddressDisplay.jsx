import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const AddressDisplay = connect(
  {
    boldName: props.boldName,
    constants: state.constants,
    contact: props.contact,
    formattedCaseDetail: state.formattedCaseDetail,
    nameOverride: props.nameOverride || {},
    noMargin: props.noMargin || false,
    openSealAddressModalSequence: sequences.openSealAddressModalSequence,
    showEmail: props.showEmail || false,
    showSealAddressLink: props.showSealAddressLink || false,
  },
  function AddressDisplay({
    boldName,
    constants,
    contact,
    nameOverride,
    noMargin,
    openSealAddressModalSequence,
    showEmail,
    showSealAddressLink,
  }) {
    const contactDetails = () => (
      <p
        className={classNames(
          'no-margin',
          contact.isAddressSealed && 'sealed-address',
        )}
      >
        {[contact.address1, contact.address2, contact.address3].map(
          addr =>
            addr && (
              <span className="address-line" key={addr}>
                {addr}
              </span>
            ),
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
            {contact.showEAccessFlag && (
              <FontAwesomeIcon
                aria-label="has e-access"
                className="margin-left-05 fa-icon-blue"
                icon="flag"
                size="1x"
              />
            )}
          </span>
        )}
        {showSealAddressLink && !contact.isAddressSealed && (
          <span className="sealed-address">
            <Button
              link
              className="red-warning"
              icon="lock"
              iconColor="red"
              onClick={() =>
                openSealAddressModalSequence({ contactToSeal: contact })
              }
            >
              Seal Address
            </Button>
          </span>
        )}
      </p>
    );

    return (
      <div className={classNames(contact.isAddressSealed && 'margin-left-205')}>
        <p className="margin-top-0 margin-bottom-2 position-relative">
          {contact.isAddressSealed && (
            <span
              aria-label="sealed address"
              className="sealed-address sealed-contact-icon"
            >
              <FontAwesomeIcon
                className="margin-right-05"
                icon={['fas', 'lock']}
                size="sm"
              />
            </span>
          )}
          <span className={boldName && 'text-bold'}>
            {nameOverride || contact.name}{' '}
          </span>
          {contact.barNumber && (
            <span className={boldName && 'text-bold'}>
              ({contact.barNumber})
              <br />
            </span>
          )}
          {contact.firmName && (
            <>
              {contact.firmName}
              <br />
            </>
          )}
          {contact.additionalName}
          {[contact.secondaryName, contact.inCareOf].map(
            contactName =>
              contactName && (
                <span key={contactName}>
                  c/o {contactName}
                  {contact.title && <span>, {contact.title}</span>}
                </span>
              ),
          )}
        </p>
        {!contact.sealedAndUnavailable && contactDetails()}
        {contact.sealedAndUnavailable && (
          <div className="sealed-address">Address sealed</div>
        )}
      </div>
    );
  },
);
