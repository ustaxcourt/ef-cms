import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const CreateCaseDeadlineModalDialog = connect(
  {
    DATE_FORMATS: state.constants.DATE_FORMATS,
    createCaseDeadlineSequence: sequences.createCaseDeadlineSequence,
    dismissModalSequence: sequences.dismissModalSequence,
    form: state.form,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateCaseDeadlineSequence: sequences.validateCaseDeadlineSequence,
    validationErrors: state.validationErrors,
  },
  function CreateCaseDeadlineModalDialog({
    createCaseDeadlineSequence,
    DATE_FORMATS,
    dismissModalSequence,
    form,
    formatAndUpdateDateFromDatePickerSequence,
    updateFormValueSequence,
    validateCaseDeadlineSequence,
    validationErrors,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={dismissModalSequence}
        confirmLabel="Save"
        confirmSequence={createCaseDeadlineSequence}
        title="Add Deadline"
      >
        <div className="ustc-create-order-modal">
          <DateSelector
            defaultValue={form.deadlineDate}
            errorText={validationErrors.deadlineDate}
            formGroupClassNames={''}
            id="deadline-date"
            label="Due date"
            onChange={e => {
              formatAndUpdateDateFromDatePickerSequence({
                key: 'deadlineDate',
                toFormat: DATE_FORMATS.ISO,
                value: e.target.value,
              });
              validateCaseDeadlineSequence();
            }}
          />

          <FormGroup errorText={validationErrors.description}>
            <label className="usa-label" htmlFor="description">
              What is this deadline for?
            </label>
            <textarea
              className="usa-textarea"
              id="description"
              maxLength="120"
              name="description"
              type="text"
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
                validateCaseDeadlineSequence();
              }}
            />
          </FormGroup>
        </div>
      </ModalDialog>
    );
  },
);

CreateCaseDeadlineModalDialog.displayName = 'CreateCaseDeadlineModalDialog';
