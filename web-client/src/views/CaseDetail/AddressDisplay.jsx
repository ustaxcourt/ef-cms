import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const AddressDisplay = connect(
  {
    addressDisplayHelper: state.addressDisplayHelper,
    constants: state.constants,
    contact: props.contact,
    editLinkExternal: props.editLinkExternal || undefined,
    editLinkInternal: props.editLinkInternal || undefined,
    formattedCaseDetail: state.formattedCaseDetail,
    nameOverride: props.nameOverride || {},
    noMargin: props.noMargin || false,
    openSealAddressModalSequence: sequences.openSealAddressModalSequence,
    showEmail: props.showEmail || false,
    showSealAddressLink: props.showSealAddressLink || false,
  },
  function AddressDisplay({
    addressDisplayHelper,
    constants,
    contact,
    editLinkExternal,
    editLinkInternal,
    nameOverride,
    noMargin,
    openSealAddressModalSequence,
    showEmail,
    showSealAddressLink,
  }) {
    return (
      <div className={classNames(contact.isAddressSealed && 'margin-left-205')}>
        <p className="no-margin position-relative">
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
          {nameOverride || contact.name}{' '}
          {editLinkExternal &&
            addressDisplayHelper[contact.contactType].showEditContact && (
              <Button
                link
                aria-label="Edit petitioner contact information"
                className="margin-left-2"
                href={editLinkExternal}
                icon="edit"
                tabIndex="0"
              >
                Edit
              </Button>
            )}
          {editLinkInternal &&
            addressDisplayHelper.showEditPetitionerInformation && (
              <Button
                link
                className="margin-left-2"
                href={editLinkInternal}
                icon="edit"
              >
                Edit
              </Button>
            )}
          {contact.barNumber && (
            <>
              ({contact.barNumber})
              <br />
            </>
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
        {!contact.sealedAndUnavailable && (
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
        )}
        {contact.sealedAndUnavailable && (
          <div className="sealed-address">Address sealed</div>
        )}
      </div>
    );
  },
);
