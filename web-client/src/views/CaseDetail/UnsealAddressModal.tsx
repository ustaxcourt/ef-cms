import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { NOT_PROVIDED } from '@shared/business/entities/EntityConstants';
export const UnsealAddressModal = connect(
  {
    clearModalFormSequence: sequences.clearModalFormSequence,
    contactToSeal: state.contactToSeal,
    unsealAddressSequence: sequences.unsealAddressSequence,
  },
  function UnsealAddressModal({
    clearModalFormSequence,
    contactToSeal,
    unsealAddressSequence,
  }) {
    if (!contactToSeal) return null;

    const title = `Unseal The Following Information for ${contactToSeal.name}?`;

    return (
      <ConfirmModal
        cancelLabel="No, Cancel"
        confirmLabel="Yes, Unseal"
        title={title}
        onCancelSequence={clearModalFormSequence}
        onConfirmSequence={unsealAddressSequence}
      >
        <div className="tw:mb-2">
          <div className="tw:flex tw:flex-wrap tw:mb-1">
            <div className="tw:w-4/12 tw:font-bold">Address:</div>
            <div
              className="tw:flex-1"
              data-testid="seal-address-modal-address-1"
            >
              {contactToSeal.address1}
            </div>
          </div>
          {contactToSeal.address2 && (
            <div className="tw:flex tw:flex-wrap tw:mb-1">
              <div className="tw:w-4/12"></div>
              <div
                className="tw:flex-1"
                data-testid="seal-address-modal-address-2"
              >
                {contactToSeal.address2}
              </div>
            </div>
          )}
          {contactToSeal.address3 && (
            <div className="tw:flex tw:flex-wrap tw:mb-1">
              <div className="tw:w-4/12"></div>
              <div
                className="tw:flex-1"
                data-testid="seal-address-modal-address-3"
              >
                {contactToSeal.address3}
              </div>
            </div>
          )}
          <div className="tw:flex tw:flex-wrap">
            <div className="tw:w-4/12"></div>
            <div className="tw:flex-1">
              <span
                className="tw:whitespace-nowrap"
                data-testid="seal-address-modal-address-city-state-zip"
              >
                {contactToSeal.city}, {contactToSeal.state}{' '}
                {contactToSeal.postalCode}
              </span>
            </div>
          </div>
        </div>

        <div className="tw:flex tw:flex-wrap tw:mb-2">
          <div className="tw:w-4/12 tw:font-bold">Phone Number:</div>
          <div className="tw:flex-1">
            <span
              className="tw:whitespace-nowrap"
              data-testid="seal-address-modal-phone"
            >
              {contactToSeal.phone}
            </span>
          </div>
        </div>
        <div className="tw:flex tw:flex-wrap tw:mb-2">
          <div className="tw:w-4/12 tw:font-bold">Service email address:</div>
          <div className="tw:flex-1">
            <span
              className="tw:whitespace-nowrap"
              data-testid="seal-address-modal-email"
            >
              {contactToSeal.email ?? NOT_PROVIDED}
            </span>
          </div>
        </div>
        <div className="tw:flex tw:flex-wrap tw:mb-2">
          <div className="tw:w-4/12 tw:font-bold">Contact email address:</div>
          <div className="tw:flex-1">
            <span
              className="tw:whitespace-nowrap"
              data-testid="seal-address-modal-address-petition-email"
            >
              {contactToSeal.contactEmailAddress ?? NOT_PROVIDED}
            </span>
          </div>
        </div>
      </ConfirmModal>
    );
  },
);

UnsealAddressModal.displayName = 'UnsealAddressModal';
