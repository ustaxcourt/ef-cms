import { ModalDialog } from '../ModalDialog';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const RemoveFromTrialSessionModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    confirmSequence: sequences.removeFromTrialSessionSequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateRemoveFromTrialSessionSequence:
      sequences.validateRemoveFromTrialSessionSequence,
    validationErrors: state.validationErrors,
  },
  ({
    cancelSequence,
    confirmSequence,
    modal,
    updateModalValueSequence,
    validateRemoveFromTrialSessionSequence,
    validationErrors,
  }) => {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Remove case"
        confirmSequence={confirmSequence}
        title="Remove From Trial Session"
      >
        <div className="margin-bottom-4" id="remove-from-trial-session-modal">
          <div className="margin-bottom-2">
            This case will be removed from this trial session.{' '}
          </div>

          <div
            className={classNames(
              'usa-form-group margin-bottom-0',
              validationErrors.disposition && 'usa-form-group--error',
            )}
          >
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="display-block" id="disposition-legend">
                Disposition
              </legend>
              <textarea
                aria-label="remove from trial session"
                className="usa-textarea"
                id="disposition"
                maxLength="120"
                name="disposition"
                type="text"
                value={modal.disposition}
                onChange={e => {
                  updateModalValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateRemoveFromTrialSessionSequence();
                }}
              />
              <Text
                bind="validationErrors.disposition"
                className="usa-error-message"
              />
            </fieldset>
          </div>
        </div>
      </ModalDialog>
    );
  },
);
