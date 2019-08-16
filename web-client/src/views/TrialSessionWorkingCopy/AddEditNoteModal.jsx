import { BindedTextarea } from '../../ustc-ui/BindedTextarea/BindedTextarea';
import { ConfirmModal } from '../../ustc-ui/Modal/ConfirmModal';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { state } from 'cerebral';
import React from 'react';

export const AddEditNoteModal = connect(
  { modal: state.modal },
  modal => {
    return (
      <ConfirmModal
        cancelLabel="Cancel"
        confirmLabel="Save"
        title="Add/Edit Notes"
        onCancelSequence="clearModalSequence"
        onConfirmSequence="updateCaseWorkingCopyNoteSequence"
      >
        <h5>
          Docket {modal.docketNumber}:{' '}
          <Text
            bind={`trialSessionWorkingCopyHelper.formattedCasesByDocketRecord.${modal.docketNumber}.caseName`}
          />
        </h5>
        <div className="usa-form-group">
          <label className="usa-label" htmlFor="case-notes">
            {"Judge's Notes"}
          </label>
          <BindedTextarea
            ariaLabel="notes"
            bind="modal.notes"
            id="case-notes"
          />
        </div>
      </ConfirmModal>
    );
  },
);
