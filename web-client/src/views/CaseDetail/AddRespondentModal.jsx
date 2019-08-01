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

    //hardcoded for now until the counsel search is built
    this.counselMatches = [
      {
        addressLine2: 'Hicksville, NY 11612',
        barNumber: 'WN7777',
        name: 'Nero West',
        userId: '2d9a7229-7d5a-459f-84ad-754504a9f10f',
      },
      {
        addressLine2: 'Shellsburg, IA 52332',
        barNumber: 'MS8888',
        name: 'Stuart Morrison',
        userId: '5c43a30d-9c3d-41be-ad13-3b6d7cef54fc',
      },
    ];
  }

  renderBody() {
    return (
      <div className="ustc-add-counsel-modal">
        <div className="usa-form-group">
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend className="usa-legend" id="counsel-matches-legend">
              Counsel Match(es) Found
            </legend>

            {this.counselMatches && this.counselMatches.length === 1 && (
              <span>
                {this.counselMatches[0].name} (
                {this.counselMatches[0].barNumber}
                )
                <br />
                {this.counselMatches[0].addressLine2}
              </span>
            )}

            {this.counselMatches &&
              this.counselMatches.length > 1 &&
              this.counselMatches.map((counsel, idx) => (
                <div className="usa-radio" key={idx}>
                  <input
                    aria-describedby="counsel-matches-legend"
                    checked={
                      (this.props.modal.user &&
                        this.props.modal.user.userId === counsel.userId) ||
                      false
                    }
                    className="usa-radio__input"
                    id={`counsel-${idx}`}
                    name="user"
                    type="radio"
                    onChange={e => {
                      this.props.updateModalValueSequence({
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
    caseDetail: state.formattedCaseDetail,
    confirmSequence: sequences.associateRespondentWithCaseSequence,
    constants: state.constants,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateSequence: sequences.validateAddCounselSequence, //TODO
    validationErrors: state.validationErrors,
  },
  AddRespondentModalComponent,
);
