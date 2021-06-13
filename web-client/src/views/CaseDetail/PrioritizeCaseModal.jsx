import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const PrioritizeCaseModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.prioritizeCaseSequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validatePrioritizeCaseSequence: sequences.validatePrioritizeCaseSequence,
    validationErrors: state.validationErrors,
  },
  function PrioritizeCaseModal({
    cancelSequence,
    confirmSequence,
    modal,
    updateModalValueSequence,
    validatePrioritizeCaseSequence,
    validationErrors,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Mark High Priority"
        confirmSequence={confirmSequence}
        title="Mark as High Priority"
      >
        <div className="margin-bottom-4" id="prioritize-case-modal">
          <div className="margin-bottom-2">
            This case will be set for trial for the next available trial
            session.{' '}
          </div>

          <FormGroup errorText={validationErrors.reason}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="display-block" id="year-filed-legend">
                Why are you prioritizing this case?
              </legend>
              <textarea
                aria-label="block from trial"
                className="usa-textarea"
                id="reason"
                maxLength="120"
                name="reason"
                type="text"
                value={modal.reason}
                onChange={e => {
                  updateModalValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validatePrioritizeCaseSequence();
                }}
              />
            </fieldset>
          </FormGroup>
        </div>
      </ModalDialog>
    );
  },
);
