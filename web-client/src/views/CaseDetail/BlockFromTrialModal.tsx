import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const BlockFromTrialModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.blockCaseFromTrialSequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateBlockFromTrialSequence: sequences.validateBlockFromTrialSequence,
    validationErrors: state.validationErrors,
  },
  function BlockFromTrialModal({
    cancelSequence,
    confirmSequence,
    modal,
    updateModalValueSequence,
    validateBlockFromTrialSequence,
    validationErrors,
  }) {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        confirmLabel="Block Case"
        confirmSequence={confirmSequence}
        title="Block From Trial"
      >
        <div className="margin-bottom-4">
          <div className="margin-bottom-2">
            This case will not be set for trial until this block is removed.{' '}
          </div>

          <FormGroup errorText={validationErrors.reason}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="display-block" id="year-filed-legend">
                Why are you blocking this case?
              </legend>
              <textarea
                aria-label="block from trial"
                className="usa-textarea"
                data-testid="blocked-from-trial-reason-textarea"
                id="reason"
                maxLength={120}
                name="reason"
                value={modal.reason}
                onChange={e => {
                  updateModalValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateBlockFromTrialSequence();
                }}
              />
            </fieldset>
          </FormGroup>
        </div>
      </ModalDialog>
    );
  },
);

BlockFromTrialModal.displayName = 'BlockFromTrialModal';
