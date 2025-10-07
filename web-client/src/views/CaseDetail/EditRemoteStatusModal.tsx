import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const EditRemoteStatusModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.blockCaseFromTrialSequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateEditRemoteStatusSequence: sequences.validateEditRemoteStatusSequence,
    validationErrors: state.validationErrors,
  },
  function EditRemoteStatusModal({
    cancelSequence,
    confirmSequence,
    modal,
    updateModalValueSequence,
    validateEditRemoteStatusSequence,
    validationErrors,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Block Case"
        confirmSequence={confirmSequence}
        title="Edit Remote Status"
      >
        <div className="margin-bottom-4">
          <div className="margin-bottom-2">
            By putting in a date, you are indicating that the Motion to Proceed Remotely was granted.{' '}
          </div>

          <FormGroup errorText={validationErrors.reason}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="display-block" id="year-filed-legend">
                Why are you blocking this case?
              </legend>
              <textarea
                aria-label="edit remote status"
                className="usa-textarea textarea-resize-vertical"
                id="reason"
                maxLength={120}
                name="reason"
                value={modal.reason}
                onChange={e => {
                  updateModalValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateEditRemoteStatusSequence();
                }}
              />
            </fieldset>
          </FormGroup>
        </div>
      </ModalDialog>
    );
  },
);

EditRemoteStatusModal.displayName = 'EditRemoteStatusModal';
