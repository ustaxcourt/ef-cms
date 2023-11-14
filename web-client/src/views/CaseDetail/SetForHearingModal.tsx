import { AddToTrialModal } from './AddToTrialModal';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const SetForHearingModal = connect(
  {
    setForHearingModalHelper: state.setForHearingModalHelper,
    setForHearingSequence: sequences.setForHearingSequence,
    validateSetForHearingSequence: sequences.validateSetForHearingSequence,
  },
  function SetForHearingModal({
    setForHearingModalHelper,
    setForHearingSequence,
    validateSetForHearingSequence,
  }) {
    return (
      <AddToTrialModal
        confirmSequence={setForHearingSequence}
        isNoteRequired={true}
        modalHelper={setForHearingModalHelper}
        modalTitle="Set for Hearing"
        validateSequence={validateSetForHearingSequence}
      />
    );
  },
);

SetForHearingModal.displayName = 'SetForHearingModal';
