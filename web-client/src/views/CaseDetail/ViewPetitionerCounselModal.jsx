import { AddressDisplay } from './AddressDisplay';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const ViewPetitionerCounselModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    contact: state.modal.contact,
    viewCounselHelper: state.viewCounselHelper,
  },
  function ViewPetitionerCounselModal({
    cancelSequence,
    contact,
    viewCounselHelper,
  }) {
    return (
      <ModalDialog
        cancelSequence={cancelSequence}
        confirmLabel="Ok"
        confirmSequence={cancelSequence}
        title="Petitioner Counsel"
      >
        <div className="margin-bottom-4" id="view-petitioner-counsel-modal">
          <AddressDisplay
            showEmail
            contact={{
              ...contact,
              ...contact.contact,
            }}
            nameOverride={contact.name}
          />
          <div className="margin-top-2">
            <strong>Representing</strong>
            {viewCounselHelper.representingNames.map(name => (
              <p key={name}>{name}</p>
            ))}
          </div>

          <strong>Service preference</strong>
          <p>{contact.serviceIndicator}</p>
        </div>
      </ModalDialog>
    );
  },
);
