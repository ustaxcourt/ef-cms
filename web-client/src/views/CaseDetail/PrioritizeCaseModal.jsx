import { ModalDialog } from '../ModalDialog';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const PrioritizeCaseModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.prioritizeCaseSequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validatePrioritizeCaseSequence: sequences.validatePrioritizeCaseSequence,
    validationErrors: state.validationErrors,
  },
  ({
    cancelSequence,
    confirmSequence,
    modal,
    updateModalValueSequence,
    validatePrioritizeCaseSequence,
    validationErrors,
  }) => {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Mark high priority"
        confirmSequence={confirmSequence}
        title="Mark as High Priority"
      >
        <div className="margin-bottom-4" id="prioritize-case-modal">
          <div className="margin-bottom-2">
            This case will be set for trial for the next available trial
            session.{' '}
          </div>

          <div
            className={classNames(
              'usa-form-group margin-bottom-0',
              validationErrors.reason && 'usa-form-group--error',
            )}
          >
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
              <Text
                bind="validationErrors.reason"
                className="usa-error-message"
              />
            </fieldset>
          </div>
        </div>
      </ModalDialog>
    );
  },
);
