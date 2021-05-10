import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const ViewPetitionerCounselModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    // viewCounselHelper: state.viewCounselHelper,
  },
  function ViewPetitionerCounselModal({ cancelSequence }) {
    return (
      <ModalDialog
        cancelSequence={cancelSequence}
        confirmLabel="Ok"
        confirmSequence={cancelSequence}
        title="Petitioner Counsel"
      >
        <div
          className="margin-bottom-4"
          id="view-petitioner-counsel-modal"
        ></div>
      </ModalDialog>
    );
  },
);
