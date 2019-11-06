import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import React from 'react';

export const SetCalendarModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.setTrialSessionCalendarSequence,
  },
  ({ cancelSequence, confirmSequence }) => {
    return (
      <ModalDialog
        cancelLabel="No, cancel"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Yes, set calendar"
        confirmSequence={confirmSequence}
        message="Once you set the calendar, you will not be able to bulk assign cases to this trial session."
        title="Are you sure you want to set the calendar for this trial session?"
      ></ModalDialog>
    );
  },
);
