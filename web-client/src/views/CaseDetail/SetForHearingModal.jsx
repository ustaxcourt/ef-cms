import { AddToTrialModal } from './AddToTrialModal';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const SetForHearingModal = connect(
  {
    confirmSequence: sequences.setForHearingSequence,
    setForHearingModalHelper: state.setForHearingModalHelper,
    validateSetForHearingSequence: sequences.validateSetForHearingSequence,
  },
  function SetForHearingModal({
    confirmSequence,
    setForHearingModalHelper,
    validateSetForHearingSequence,
  }) {
    return (
      <AddToTrialModal
        calendarNotesRequired={true}
        confirmSequence={confirmSequence}
        modalHeading={'Set for Hearing'}
        modalHelper={setForHearingModalHelper}
        validateSequence={validateSetForHearingSequence}
      />
    );
  },
);
