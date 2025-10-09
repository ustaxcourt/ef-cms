import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { createStartOfDayISO } from '@shared/business/utilities/DateHandler';

export const EditRemoteStatusModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.editRemoteStatusSequence,
    clearSequence: sequences.clearRemoteStatusSequence,
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
    clearSequence,
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
        clearLabel="Clear date"
        clearSequence={clearSequence}
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
                data-testid="remote-trial-granted-date"
                defaultValue={modal.remoteTrialGrantedDate}
                id="remote-trial-granted-date"
                label="Date granted: MM/DD/YYYY"
                maxDate={createStartOfDayISO()}
                onChange={e => {
                  updateModalValueSequence({
                    key: 'remoteTrialGrantedDate',
                    value: e.target.value,
                  });
                  validateEditRemoteTrialModalSequence();
                }}
                placeHolderText="Select Date"
              />
            </div>
          </FormGroup>
        </div>
      </ModalDialog>
    );
  },
);

EditRemoteStatusModal.displayName = 'EditRemoteStatusModal';
