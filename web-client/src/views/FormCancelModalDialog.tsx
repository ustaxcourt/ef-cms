import { ModalDialog } from './ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import React from 'react';

type Props = {
  onCancelSequence: Function;
  useRunConfirmSequence?: boolean;
};

const deps = { cancelSequence: sequences.dismissModalSequence };

export const FormCancelModalDialog = connect<Props, typeof deps>(
  deps,
  function FormCancelModalDialog({
    cancelSequence,
    onCancelSequence,
    useRunConfirmSequence,
  }) {
    return (
      <ModalDialog
        cancelLabel="No, Take Me Back"
        cancelSequence={cancelSequence}
        confirmLabel="Yes, Cancel"
        confirmSequence={onCancelSequence}
        message="If you cancel, your form selections will be lost."
        title="Are You Sure You Want to Cancel?"
        useRunConfirmSequence={useRunConfirmSequence}
      ></ModalDialog>
    );
  },
);

FormCancelModalDialog.displayName = 'FormCancelModalDialog';
