import { ModalDialog } from '../ModalDialog';
import { Text } from '../../ustc-ui/Text/Text';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

class AddRespondentModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'Cancel',
      classNames: '',
      confirmLabel: 'Add to Case',
      title: 'Add Respondent Counsel',
    };
  }

  renderBody() {
    const { caseDetailHelper, modal, updateModalValueSequence } = this.props;

    return (
      <div className="ustc-add-counsel-modal">
        <div
          className={classNames(
            'usa-form-group',
            this.props.validationErrors.user && 'usa-form-group--error',
          )}
        >
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend className="usa-legend" id="counsel-matches-legend">
              {caseDetailHelper.respondentSearchResultsCount} counsel match(es)
              found
            </legend>

            {caseDetailHelper.respondentSearchResultsCount === 1 && (
              <span>
                {modal.respondentMatches[0].name} (
                {modal.respondentMatches[0].barNumber}
                )
                <br />
                {modal.respondentMatches[0].address2}
              </span>
            )}
            <div className="respondent-matches">
              {caseDetailHelper.respondentSearchResultsCount > 1 &&
                modal.respondentMatches.map((counsel, idx) => (
                  <div className="usa-radio" key={idx}>
                    <input
                      aria-describedby="counsel-matches-legend"
                      checked={
                        (modal.user && modal.user.userId === counsel.userId) ||
                        false
                      }
                      className="usa-radio__input"
                      id={`counsel-${idx}`}
                      name="user"
                      type="radio"
                      onChange={e => {
                        updateModalValueSequence({
                          key: e.target.name,
                          value: counsel,
                        });
                        this.props.validateSequence();
                      }}
                    />
                    <label
                      className="usa-radio__label"
                      htmlFor={`counsel-${idx}`}
                    >
                      {counsel.name} ({counsel.barNumber})
                      <br />
                      {counsel.address2}
                    </label>
                  </div>
                ))}
            </div>
            <Text bind="validationErrors.user" className="usa-error-message" />
          </fieldset>
        </div>
      </div>
    );
  }
}

export const AddRespondentModal = connect(
  {
    cancelSequence: sequences.clearModalSequence,
    caseDetailHelper: state.caseDetailHelper,
    confirmSequence: sequences.associateRespondentWithCaseSequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateSequence: sequences.validateAddRespondentSequence,
    validationErrors: state.validationErrors,
  },
  AddRespondentModalComponent,
);
