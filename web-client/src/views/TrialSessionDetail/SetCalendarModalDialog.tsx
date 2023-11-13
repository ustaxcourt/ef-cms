import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const SetCalendarModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.setTrialSessionCalendarSequence,
  },
  function SetCalendarModalDialog({ cancelSequence, confirmSequence }) {
    return (
      <ModalDialog
        cancelLabel="No, Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Yes, Set Calendar"
        confirmSequence={confirmSequence}
        message="Once you set the calendar, you will not be able to bulk assign cases to this trial session."
        title="Are you sure you want to set the calendar for this trial session?"
      ></ModalDialog>
    );
  },
);

SetCalendarModalDialog.displayName = 'SetCalendarModalDialog';
