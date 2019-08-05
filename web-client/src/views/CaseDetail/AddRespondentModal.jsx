import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

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
        <div className="usa-form-group">
          <fieldset className="usa-fieldset margin-bottom-0 respondent-matches">
            <legend className="usa-legend" id="counsel-matches-legend">
              {caseDetailHelper.respondentSearchResultsCount} Counsel Match(es)
              Found
            </legend>

            {caseDetailHelper.respondentSearchResultsCount === 1 && (
              <span>
                {modal.respondentMatches[0].name} (
                {modal.respondentMatches[0].barNumber}
                )
                <br />
                {modal.respondentMatches[0].addressLine2}
              </span>
            )}

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
                    }}
                  />
                  <label
                    className="usa-radio__label"
                    htmlFor={`counsel-${idx}`}
                  >
                    {counsel.name} ({counsel.barNumber})
                    <br />
                    {counsel.addressLine2}
                  </label>
                </div>
              ))}
          </fieldset>
        </div>
      </div>
    );
  }
}

export const AddRespondentModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    caseDetailHelper: state.caseDetailHelper,
    confirmSequence: sequences.associateRespondentWithCaseSequence,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateSequence: sequences.validateAddCounselSequence, //TODO
    validationErrors: state.validationErrors,
  },
  AddRespondentModalComponent,
);
