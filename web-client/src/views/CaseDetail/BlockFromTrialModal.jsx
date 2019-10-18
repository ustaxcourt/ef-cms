import { ModalDialog } from '../ModalDialog';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

class BlockFromTrialModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'Cancel',
      classNames: '',
      confirmLabel: 'Block case',
      title: 'Block From Trial',
    };
  }

  renderBody() {
    const {
      modal,
      updateModalValueSequence,
      validateBlockFromTrialSequence,
      validationErrors,
    } = this.props;

    return (
      <div className="margin-bottom-4">
        <div className="margin-bottom-2">
          This case will not be set for trial until this block is removed.{' '}
        </div>

        <div
          className={classNames(
            'usa-form-group margin-bottom-0',
            validationErrors.reason && 'usa-form-group--error',
          )}
        >
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend className="display-block" id="year-filed-legend">
              Why are you blocking this case?
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
                validateBlockFromTrialSequence();
              }}
            />
            <Text
              bind="validationErrors.reason"
              className="usa-error-message"
            />
          </fieldset>
        </div>
      </div>
    );
  }
}

export const BlockFromTrialModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    caseDetailHelper: state.caseDetailHelper,
    confirmSequence: sequences.blockFromTrialSequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateBlockFromTrialSequence: sequences.validateBlockFromTrialSequence,
    validateSequence: sequences.validateAddRespondentSequence,
    validationErrors: state.validationErrors,
  },
  BlockFromTrialModalComponent,
);
