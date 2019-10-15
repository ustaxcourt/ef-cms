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
      classNames: 'counsel-modal',
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
                {caseDetailHelper.respondentMatchesFormatted[0].name} (
                {caseDetailHelper.respondentMatchesFormatted[0].barNumber}
                )
                <br />
                {caseDetailHelper.respondentMatchesFormatted[0].cityStateZip}
              </span>
            )}
            <div className="respondent-matches">
              {caseDetailHelper.respondentSearchResultsCount > 1 &&
                caseDetailHelper.respondentMatchesFormatted.map(
                  (counsel, idx) => (
                    <div
                      className={classNames(
                        'usa-radio',
                        'padding-1',
                        counsel.isAlreadyInCase && 'bg-gold',
                      )}
                      key={idx}
                    >
                      {counsel.isAlreadyInCase && (
                        <div className="float-right text-italic padding-right-1">
                          Counsel is already associated with this case.
                        </div>
                      )}
                      {!counsel.isAlreadyInCase && (
                        <input
                          aria-describedby="counsel-matches-legend"
                          checked={
                            (modal.user &&
                              modal.user.userId === counsel.userId) ||
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
                      )}

                      <label
                        className={classNames(
                          counsel.isAlreadyInCase && 'hide-radio',
                          'usa-radio__label',
                        )}
                        htmlFor={`counsel-${idx}`}
                      >
                        {counsel.name} ({counsel.barNumber})
                        <br />
                        {counsel.cityStateZip}
                      </label>
                    </div>
                  ),
                )}
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
