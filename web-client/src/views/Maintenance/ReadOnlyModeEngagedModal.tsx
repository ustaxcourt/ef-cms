import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { isEmpty } from 'lodash';

export const ReadOnlyModeEngagedModal = connect(
  {
    clearModalSequence: sequences.clearModalSequence,
    form: state.form,
  },
  function ReadOnlyModeEngagedModal({ clearModalSequence, form }) {
    const isFormDirty = !isEmpty(form);

    return (
      <ModalDialog
        preventCancelOnBlur
        className="read-only-mode-engaged-modal"
        closeLink={false}
        confirmLabel="Close"
        confirmOverrideReadOnly={true}
        confirmSequence={clearModalSequence}
        title="We are performing maintenance"
      >
        <div>
          We are performing maintenance. During this time, you cannot submit filings or
          edit information.
        </div>
        {isFormDirty && (
          <div className="margin-top-2">
            <strong>Please do not leave this page!</strong> You have unsaved changes. You may continue to edit them, and you will be able to save once maintenance is complete.
          </div>
        )}
      </ModalDialog>
    );
  },
);

ReadOnlyModeEngagedModal.displayName = 'ReadOnlyModeEngagedModal';
