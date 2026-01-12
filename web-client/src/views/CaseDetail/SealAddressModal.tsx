import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { NOT_PROVIDED } from '@shared/business/entities/EntityConstants';
export const SealAddressModal = connect(
  {
    clearModalFormSequence: sequences.clearModalFormSequence,
    contactToSeal: state.contactToSeal,
    sealAddressSequence: sequences.sealAddressSequence,
  },
  function SealAddressModal({
    clearModalFormSequence,
    contactToSeal,
    sealAddressSequence,
  }) {
    if (!contactToSeal) return null;
    
    const title = `Seal The Following Information for ${contactToSeal.name}?`;

    return (
      <ConfirmModal
        cancelLabel="No, Cancel"
        confirmLabel="Yes, Seal"
        title={title}
        onCancelSequence={clearModalFormSequence}
        onConfirmSequence={sealAddressSequence}
      >
        <div className="margin-bottom-1">
          <div className="grid-row margin-bottom-05">
            <div className="grid-col-4 text-bold">Address:</div>
            <div
              className="grid-col-fill"
              data-testid="seal-address-modal-address-1"
            >
              {contactToSeal.address1}
            </div>
          </div>
          {contactToSeal.address2 && (
            <div className="grid-row margin-bottom-05">
              <div className="grid-col-4"></div>
              <div
                className="grid-col-fill"
                data-testid="seal-address-modal-address-2"
              >
                {contactToSeal.address2}
              </div>
            </div>
          )}
          {contactToSeal.address3 && (
            <div className="grid-row margin-bottom-05">
              <div className="grid-col-4"></div>
              <div
                className="grid-col-fill"
                data-testid="seal-address-modal-address-3"
              >
                {contactToSeal.address3}
              </div>
            </div>
          )}
          <div className="grid-row">
            <div className="grid-col-4"></div>
            <div className="grid-col-fill">
              <span
                className="no-wrap"
                data-testid="seal-address-modal-address-city-state-zip"
              >
                {contactToSeal.city}, {contactToSeal.state}{' '}
                {contactToSeal.postalCode}
              </span>
            </div>
          </div>
        </div>

        <div className="grid-row margin-bottom-1">
          <div className="grid-col-4 text-bold">Phone Number:</div>
          <div className="grid-col-fill">
            <span className="no-wrap" data-testid="seal-address-modal-phone">
              {contactToSeal.phone}
            </span>
          </div>
        </div>
        <div className="grid-row margin-bottom-1">
          <div className="grid-col-4 text-bold">Email Address:</div>
          <div className="grid-col-fill">
            <span className="no-wrap" data-testid="seal-address-modal-email">
              {contactToSeal.email ?? NOT_PROVIDED}
            </span>
          </div>
        </div>
        <div className="grid-row margin-bottom-1">
          <div className="grid-col-4 text-bold">Petition Email:</div>
          <div className="grid-col-fill">
            <span
              className="no-wrap"
              data-testid="seal-address-modal-address-petition-email"
            >
              {contactToSeal.paperPetitionEmail ?? NOT_PROVIDED}
            </span>
          </div>
        </div>
      </ConfirmModal>
    );
  },
);

SealAddressModal.displayName = 'SealAddressModal';
