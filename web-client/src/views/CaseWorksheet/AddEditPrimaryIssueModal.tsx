import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const AddEditPrimaryIssueModal = connect(
  {
    addEditPrimaryIssueModalHelper: state.addEditPrimaryIssueModalHelper,
    validationErrors: state.validationErrors,
  },
  function AddEditPrimaryIssueModal({
    addEditPrimaryIssueModalHelper,
    validationErrors,
  }) {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Save"
        preventCancelOnBlur={true}
        title="Add/Edit Primary Issue"
        onCancelSequence="clearModalFormSequence"
        onConfirmSequence="updatePrimaryIssueSequence"
      >
        <h5 className="margin-bottom-4">
          {addEditPrimaryIssueModalHelper.title}
        </h5>

        <FormGroup
          className="margin-bottom-2"
          errorText={validationErrors.primaryIssue}
        >
          <BindedTextarea
            aria-label="notes"
            bind="modal.primaryIssue"
            id="primary-issue"
          />
        </FormGroup>
      </ConfirmModal>
    );
  },
);

AddEditPrimaryIssueModal.displayName = 'AddEditPrimaryIssueModal';
