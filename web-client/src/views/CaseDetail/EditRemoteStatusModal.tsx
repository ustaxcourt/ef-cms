import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import {
  createStartOfDayISO,
  formatDateString,
  FORMATS,
} from '@shared/business/utilities/DateHandler';

export const EditRemoteStatusModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.editRemoteStatusSequence,
    clearSequence: sequences.clearRemoteStatusSequence,
    constants: state.constants,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    modal: state.modal,
    validateEditRemoteTrialModalSequence:
      sequences.validateEditRemoteTrialModalSequence,
    validationErrors: state.validationErrors,
  },
  function EditRemoteStatusModal({
    cancelSequence,
    confirmSequence,
    clearSequence,
    constants,
    formatAndUpdateDateFromDatePickerSequence,
    modal,
    validateEditRemoteTrialModalSequence,
    validationErrors,
  }) {
    const maxDate = formatDateString(createStartOfDayISO(), FORMATS.YYYYMMDD);
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className="edit-remote-status-modal"
        confirmLabel="Save"
        confirmSequence={confirmSequence}
        clearLabel="Clear date"
        clearSequence={clearSequence}
        title="Edit Remote Status"
      >
        <div className="margin-bottom-4">
          <div className="margin-bottom-2">
            Enter the date the Motion to Proceed Remotely was granted.{' '}
          </div>
          <FormGroup>
            <div className="edit-remote-trial-date-picker">
              <p className="text-semibold Dawson_body Dawson_body_secondary">
                Date granted: <span className="text-light">MM/DD/YYYY</span>
              </p>
              <div className="grid-col-4">
                <DateSelector
                  data-testid="remote-trial-granted-date"
                  defaultValue={modal.remoteTrialGrantedDate}
                  errorText={validationErrors.remoteTrialGrantedDate}
                  id="remote-trial-granted-date"
                  maxDate={maxDate}
                  pristine={!modal.remoteTrialGrantedDate}
                  onChange={e => {
                    formatAndUpdateDateFromDatePickerSequence({
                      key: 'remoteTrialGrantedDate',
                      root: 'modal',
                      toFormat: constants.DATE_FORMATS.ISO,
                      value: e.target.value,
                    });
                    validateEditRemoteTrialModalSequence();
                  }}
                  placeHolderText="Select Date"
                />
              </div>
            </div>
          </FormGroup>
        </div>
      </ModalDialog>
    );
  },
);

EditRemoteStatusModal.displayName = 'EditRemoteStatusModal';
