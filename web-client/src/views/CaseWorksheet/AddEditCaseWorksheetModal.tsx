import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AddEditCaseWorksheetModal = connect(
  {
    DATE_FORMATS: state.constants.DATE_FORMATS,
    STATUS_OF_MATTER_OPTIONS: state.constants.STATUS_OF_MATTER_OPTIONS,
    addEditCaseWorksheetModalHelper: state.addEditCaseWorksheetModalHelper,
    form: state.form,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateCaseWorksheetSequence: sequences.validateCaseWorksheetSequence,
    validationErrors: state.validationErrors,
  },
  function AddEditCaseWorksheetModal({
    addEditCaseWorksheetModalHelper,
    DATE_FORMATS,
    form,
    formatAndUpdateDateFromDatePickerSequence,
    STATUS_OF_MATTER_OPTIONS,
    updateFormValueSequence,
    validateCaseWorksheetSequence,
    validationErrors,
  }) {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Save"
        preventCancelOnBlur={true}
        title="Edit Details"
        onCancelSequence="dismissAddEditCaseWorksheetModalSequence"
        onConfirmSequence="updateCaseWorksheetSequence"
      >
        <h5 className="margin-bottom-4">
          {addEditCaseWorksheetModalHelper.title}
        </h5>

        <DateSelector
          showDateHint
          defaultValue={form.finalBriefDueDate}
          errorText={validationErrors.finalBriefDueDate}
          formGroupClassNames={'width-half'}
          id="final-brief-due-date"
          label="Final brief due date"
          onChange={e => {
            formatAndUpdateDateFromDatePickerSequence({
              key: 'finalBriefDueDate',
              toFormat: DATE_FORMATS.YYYYMMDD,
              value: e.target.value,
            });
            validateCaseWorksheetSequence();
          }}
        />

        <FormGroup>
          <label
            className="usa-label"
            htmlFor="status-of-matter"
            id="status-of-matter-label"
          >
            Status of matter
          </label>
          <select
            aria-labelledby="status-of-matter-label"
            className="usa-select"
            id="status-of-matter"
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
          <label
            className="usa-label"
            htmlFor="primary-issue"
            id="primary-issue-label"
          >
            Primary issue
          </label>
          <BindedTextarea
            aria-labelledby="primary-issue-label"
            bind="form.primaryIssue"
            className="resize-vertical-only"
            id="primary-issue"
          />
        </FormGroup>
      </ConfirmModal>
    );
  },
);

AddEditCaseWorksheetModal.displayName = 'AddEditCaseWorksheetModal';
