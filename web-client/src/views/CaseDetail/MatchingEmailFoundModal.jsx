import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const MatchingEmailFoundModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence:
      sequences.submitUpdatePetitionerInformationFromModalSequence,
    form: state.form,
  },
  function MatchingEmailFoundModal({ cancelSequence, confirmSequence, form }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Yes, Continue"
        confirmSequence={confirmSequence}
        title="Matching Email Found"
      >
        <div id="matching-email-modal">
          <p>
            {form.contact.name}
            <br />
            {form.contact.updatedEmail}
          </p>

          <p>This case will be added to the matching email account.</p>

          <p>Do you want to continue?</p>
        </div>
      </ModalDialog>
    );
  },
);
