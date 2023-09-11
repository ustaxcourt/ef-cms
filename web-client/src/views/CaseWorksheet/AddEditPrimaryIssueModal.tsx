import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { DateInput } from '@web-client/ustc-ui/DateInput/DateInput';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AddEditPrimaryIssueModal = connect(
  {
    STATUS_OF_MATTER_OPTIONS: state.constants.STATUS_OF_MATTER_OPTIONS,
    addEditPrimaryIssueModalHelper: state.addEditPrimaryIssueModalHelper,
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function AddEditPrimaryIssueModal({
    addEditPrimaryIssueModalHelper,
    form,
    STATUS_OF_MATTER_OPTIONS,
    updateFormValueSequence,
    validationErrors,
  }) {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Save"
        preventCancelOnBlur={true}
        title="Add/Edit Case Worksheet"
        onCancelSequence="clearModalFormSequence"
        onConfirmSequence="updatePrimaryIssueSequence"
      >
        <h5 className="margin-bottom-4">
          {addEditPrimaryIssueModalHelper.title}
        </h5>
        <FormGroup className="margin-bottom-0">
          {/* <DateInput
            errorText={validationErrors.deadlineDate}
            id="deadline-date"
            label="Due date"
            values={form}
            onBlur={validateCaseDeadlineSequence}
            onChange={updateFormValueSequence}
          /> */}

          <DateInput
            errorText={validationErrors.finalBriefDueDate}
            id={'final-brief-due-date'}
            label="Final Brief Due Date"
            showDateHint={false}
            values={form}
            // onBlur={validateCaseDeadlineSequence}
            // onChange={updateFormValueSequence}
            // values={convertToDateInputValues(
            //   formattedCase.worksheet.finalBriefDueDate,
            // )}
            // onValueChange={value => {
            //   updateFinalBriefDueDateSequence({
            //     docketNumber: formattedCase.docketNumber,
            //     finalBriefDueDate: value === '' ? null : value,
            //   });
            // }}
          />
        </FormGroup>
        <FormGroup>
          <select
            aria-label="status of matter"
            className="usa-select"
            name="statusOfMatter"
            value={form.statusOfMatter}
            onChange={e => {
              updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
            }}
          >
            <option value="">- Select -</option>
            {STATUS_OF_MATTER_OPTIONS.map(from => (
              <option key={from} value={from}>
                {from}
              </option>
            ))}
          </select>
        </FormGroup>
        <FormGroup
          className="margin-bottom-2"
          errorText={validationErrors.primaryIssue}
        >
          <BindedTextarea
            aria-label="notes"
            bind="form.primaryIssue"
            id="primary-issue"
          />
        </FormGroup>

        {console.log('**** ', form)}
      </ConfirmModal>
    );
  },
);

AddEditPrimaryIssueModal.displayName = 'AddEditPrimaryIssueModal';
