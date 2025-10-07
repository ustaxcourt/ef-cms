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
    validateEditRemoteStatusSequence: sequences.validateEditRemoteStatusSequence,
    validationErrors: state.validationErrors,
  },
  function EditRemoteStatusModal({
    cancelSequence,
    confirmSequence,
    modal,
    updateModalValueSequence,
    validationErrors,
  }) {

    const dateGranted = 'MM/DD/YYYY';
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
            By putting in a date, you are indicating that the Motion to Proceed Remotely was granted.{' '}
          </div>

          <FormGroup errorText={validationErrors.reason}>
            <fieldset className="usa-fieldset">
              <p className="display-block" id="year-filed-legend">
                <b>Date granted:</b> {dateGranted}
              </p>
              <DateSelector
                defaultValue={modal.dateGranted ? modal.selectDate : 'Select date'}
                formGroupClassNames={''}
                id="date-granted-motr"
                onChange={e => {
                  updateModalValueSequence({key: "date-granted", value: e.target.value});
                  // validateEditRemoteTrialModalSequence()
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
