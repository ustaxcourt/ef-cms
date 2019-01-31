import { connect } from '@cerebral/react';
import { sequences } from 'cerebral';
import ModalDialog from './ModalDialog';

class StartCaseCancelModalDialog extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      title: 'Are you sure you want to cancel?',
      message: 'If you cancel, your form selections will be lost.',
      confirmLabel: 'Yes, cancel',
      cancelLabel: 'No, continue',
      classNames: '',
    };
  }
}

export default connect(
  {
    cancelSequence: sequences.startACaseToggleCancelSequence,
    confirmSequence: sequences.startACaseConfirmCancelSequence,
  },
  StartCaseCancelModalDialog,
);
