import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';

class SetCalendarModalDialogComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'No, cancel',
      classNames: '',
      confirmLabel: 'Yes, set calendar',
      message:
        'Once you set the calendar, you will not be able to bulk assign cases to this trial session.',
      title:
        'Are you sure you want to set the calendar for this trial session?',
    };
  }
}

export const SetCalendarModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.setTrialSessionCalendarSequence,
  },
  SetCalendarModalDialogComponent,
);
