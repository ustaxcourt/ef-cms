import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { DateInputThatActuallyWorks } from '@web-client/ustc-ui/DateInput/DateInputThatActuallyWorks';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AddEditCaseWorksheetModal = connect(
  {
    STATUS_OF_MATTER_OPTIONS: state.constants.STATUS_OF_MATTER_OPTIONS,
    addEditCaseWorksheetModalHelper: state.addEditCaseWorksheetModalHelper,
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateCaseWorksheetSequence: sequences.validateCaseWorksheetSequence,
    validationErrors: state.validationErrors,
  },
  function AddEditCaseWorksheetModal({
    addEditCaseWorksheetModalHelper,
    form,
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
        title="Add/Edit Case Worksheet"
        onCancelSequence="clearModalFormSequence"
        onConfirmSequence="updateCaseWorksheetSequence"
      >
        <h5 className="margin-bottom-4">
          {addEditCaseWorksheetModalHelper.title}
        </h5>

        <DateInputThatActuallyWorks
          errorText={validationErrors.finalBriefDueDate}
          formGroupClassNames={'width-half'}
          label={'Final brief due date'}
          onChange={e => {
            updateFormValueSequence({
              key: 'finalBriefDueDate',
              value: e.target.value,
            });
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
            id="primary-issue"
          />
        </FormGroup>

        {console.log('**** ', form)}
      </ConfirmModal>
    );
  },
);

AddEditCaseWorksheetModal.displayName = 'AddEditCaseWorksheetModal';
