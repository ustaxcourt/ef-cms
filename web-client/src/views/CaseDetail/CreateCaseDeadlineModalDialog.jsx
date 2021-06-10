import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const CreateCaseDeadlineModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.createCaseDeadlineSequence,
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateCaseDeadlineSequence: sequences.validateCaseDeadlineSequence,
    validationErrors: state.validationErrors,
  },
  function CreateCaseDeadlineModalDialog({
    cancelSequence,
    confirmSequence,
    form,
    updateFormValueSequence,
    validateCaseDeadlineSequence,
    validationErrors,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Save"
        confirmSequence={confirmSequence}
        title="Add Deadline"
      >
        <div className="ustc-create-order-modal">
          <DateInput
            errorText={validationErrors.deadlineDate}
            id="deadline-date"
            label="Due date"
            values={form}
            onBlur={validateCaseDeadlineSequence}
            onChange={updateFormValueSequence}
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
