import { Button } from '../../ustc-ui/Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

const OtherPetitionerDisplay = connect(
  {
    caseInformationHelper: state.caseInformationHelper,
    constants: state.constants,
    openSealAddressModalSequence: sequences.openSealAddressModalSequence,
    petitioner: props.petitioner,
  },
  function OtherPetitionerDisplay({
    caseInformationHelper,
    constants,
    openSealAddressModalSequence,
    petitioner,
  }) {
    return (
      <div
        className={classNames(petitioner.isAddressSealed && 'margin-left-205')}
      >
        <p className="no-margin address-name position-relative">
          {petitioner.isAddressSealed && (
            <span className="sealed-address sealed-contact-icon">
              <FontAwesomeIcon
                className="margin-right-05"
                icon={['fas', 'lock']}
                size="sm"
              />
            </span>
          )}
          {petitioner.name}
          {petitioner.secondaryName && (
            <>
              <br />
              {petitioner.secondaryName}
              {petitioner.title && <span>, {petitioner.title}</span>}
            </>
          )}
        </p>
        <p
          className={classNames(
            'margin-top-0',
            caseInformationHelper.showSealAddressLink &&
              petitioner.isAddressSealed &&
              'sealed-address',
          )}
        >
          {petitioner.address1 && (
            <span className="address-line">{petitioner.address1}</span>
          )}
          {petitioner.address2 && (
            <span className="address-line">{petitioner.address2}</span>
          )}
          {petitioner.address3 && (
            <span className="address-line">{petitioner.address3}</span>
          )}
          <span className="address-line">
            {petitioner.city && `${petitioner.city}, `}
            {petitioner.state} {petitioner.postalCode}
          </span>
          {petitioner.countryType === constants.COUNTRY_TYPES.INTERNATIONAL && (
            <span className="address-line">{petitioner.country}</span>
          )}
          {petitioner.phone && (
            <span className="address-line margin-top-1">
              {petitioner.phone}
            </span>
          )}
          {petitioner.email && (
            <span className="address-line">
              {petitioner.email}
              {petitioner.showEAccessFlag && (
                <FontAwesomeIcon
                  className="margin-left-05 fa-icon-blue"
                  icon="flag"
                  size="1x"
                />
              )}
            </span>
          )}
          {caseInformationHelper.showSealAddressLink &&
            !petitioner.isAddressSealed && (
              <span className="sealed-address">
                <Button
                  link
                  className="red-warning"
                  icon="lock"
                  iconColor="red"
                  onClick={() =>
                    openSealAddressModalSequence({ contactToSeal: petitioner })
                  }
                >
                  Seal Address
                </Button>
              </span>
            )}
        </p>
      </div>
    );
  },
);

export { OtherPetitionerDisplay };
