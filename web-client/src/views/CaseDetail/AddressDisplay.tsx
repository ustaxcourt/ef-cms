import { Button } from '../../ustc-ui/Button/Button';
import { COUNTRY_TYPES } from '@shared/business/entities/EntityConstants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

const addessDisplayDeps = {
  formattedCaseDetail: state.formattedCaseDetail,
  openSealAddressModalSequence: sequences.openSealAddressModalSequence,
};

export const AddressDisplay = connect<
  {
    boldName?: boolean;
    contact: any;
    displayFirmNameOnNewLine?: boolean;
    nameOverride?: string;
    noMargin?: boolean;
    showEmail?: boolean;
    showEmailLabel?: boolean;
    showPhoneLabel?: boolean;
    showSealAddressLink?: boolean;
  },
  typeof addessDisplayDeps
>(
  addessDisplayDeps,
  function AddressDisplay({
    boldName,
    contact,
    displayFirmNameOnNewLine = false,
    nameOverride,
    noMargin,
    openSealAddressModalSequence,
    showEmail,
    showEmailLabel,
    showPhoneLabel,
    showSealAddressLink,
  }) {
    return (
      <div className={classNames(contact.isAddressSealed && 'margin-left-205')}>
        <div className="margin-top-0 position-relative">
          {contact.isAddressSealed && (
            <span
              aria-label="sealed address"
              className="sealed-address sealed-contact-icon"
              role="img"
            >
              <FontAwesomeIcon
                className="margin-right-05"
                icon={['fas', 'lock']}
                size="sm"
              />
            </span>
          )}
          <span
            className={boldName ? 'text-bold' : undefined}
            data-testid="contact-name"
          >
            {nameOverride || contact.name}{' '}
          </span>
          {contact.barNumber && (
            <span className={boldName ? 'text-bold' : ''}>
              ({contact.barNumber})
              <br />
            </span>
          )}
          {contact.firmName &&
            (displayFirmNameOnNewLine ? (
              <div className="line-height-body-5" data-testid="firm-name">
                {contact.firmName}
              </div>
            ) : (
              <span data-testid="firm-name">
                {contact.firmName}
                <br />
              </span>
            ))}
          {contact.additionalName}
          {[contact.secondaryName, contact.inCareOf].map(
            contactName =>
              contactName && (
                <span
                  data-testid="contact-in-care-of-secondary-name"
                  key={contactName}
                >
                  c/o {contactName}
                  {contact.title && <span>, {contact.title}</span>}
                </span>
              ),
          )}
        </div>
        <div>
          {!contact.sealedAndUnavailable && (
            <ContactDetails
              contact={contact}
              noMargin={noMargin}
              openSealAddressModalSequence={openSealAddressModalSequence}
              showEmail={showEmail}
              showEmailLabel={showEmailLabel}
              showPhoneLabel={showPhoneLabel}
              showSealAddressLink={showSealAddressLink}
            />
          )}
        </div>
        {contact.sealedAndUnavailable && (
          <div className="sealed-address">Address sealed</div>
        )}
      </div>
    );
  },
);

function ContactDetails({
  contact,
  noMargin,
  openSealAddressModalSequence,
  showEmail,
  showEmailLabel,
  showPhoneLabel,
  showSealAddressLink,
}) {
  return (
    <p
      className={classNames(
        'no-margin',
        contact.isAddressSealed && 'sealed-address',
      )}
      data-testid="contact-address-information"
    >
      <span className="address-line" data-testid="address1-line">
        {contact.address1}
      </span>
      <span className="address-line">{contact.address2}</span>
      <span className="address-line">{contact.address3}</span>
      <span className="address-line">
        {contact.city && `${contact.city}, `}
        {contact.state} {contact.postalCode}
      </span>
      {contact.countryType === COUNTRY_TYPES.INTERNATIONAL && (
        <span className="address-line" data-testid="contact-country-line">
          {contact.country}
        </span>
      )}
      {contact.phone && (
        <span
          className={classNames(
            noMargin ? 'no-margin' : 'margin-top-1',
            'address-line',
          )}
          data-testid="contact-info-phone-number"
        >
          {showPhoneLabel && <span className="text-semibold">Phone: </span>}
          {contact.phone}
        </span>
      )}
      {contact.email && showEmail && (
        <span className="address-line">
          <span data-testid="contact-info-email">
            {showEmailLabel && <span className="text-semibold">Email: </span>}
            {contact.email}
          </span>
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
}
AddressDisplay.displayName = 'AddressDisplay';
