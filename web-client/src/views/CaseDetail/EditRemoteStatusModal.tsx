import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';

export const EditRemoteStatusModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.editRemoteStatusSequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateEditRemoteStatusSequence:
      sequences.validateEditRemoteStatusSequence,
    validateEditRemoteTrialModalSequence:
      sequences.validateEditRemoteTrialModalSequence,
    validationErrors: state.validationErrors,
  },
  function EditRemoteStatusModal({
    cancelSequence,
    confirmSequence,
    modal,
    updateModalValueSequence,
    validateEditRemoteTrialModalSequence,
    validationErrors,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Save"
        confirmSequence={confirmSequence}
        title="Edit Remote Status"
      >
        <div className="margin-bottom-4">
          <div className="margin-bottom-2">
            By putting in a date, you are indicating that the Motion to Proceed
            Remotely was granted.{' '}
          </div>

          <FormGroup errorText={validationErrors.remoteTrialGrantedDate}>
            <div className="edit-remote-trial-date-picker">
              <DateSelector
                defaultValue={modal.remoteTrialGrantedDate}
                id="remote-trial-granted-date"
                label="Date granted: MM/DD/YYYY"
                placeHolderText="Select Date"
                data-testid="remote-trial-granted-date"
                onChange={e => {
                  updateModalValueSequence({
                    key: 'remoteTrialGrantedDate',
                    value: e.target.value,
                  });
                  validateEditRemoteTrialModalSequence();
                }}
              />
            </div>
          </FormGroup>
        </div>
      </ModalDialog>
    );
  },
);

EditRemoteStatusModal.displayName = 'EditRemoteStatusModal';
