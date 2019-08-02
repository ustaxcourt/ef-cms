import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

class AddPractitionerModalComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'Cancel',
      classNames: '',
      confirmLabel: 'Add to Case',
      title: 'Add Petitioner Counsel',
    };
  }

  renderBody() {
    return (
      <div className="ustc-add-counsel-modal">
        <div className="usa-form-group">
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend className="usa-legend" id="counsel-matches-legend">
              Counsel Match(es) Found
            </legend>

            {this.props.modal.practitionerMatches &&
              this.props.modal.practitionerMatches.length === 1 && (
                <span>
                  {this.props.modal.practitionerMatches[0].name} (
                  {this.props.modal.practitionerMatches[0].barNumber}
                  )
                  <br />
                  {this.props.modal.practitionerMatches[0].addressLine2}
                </span>
              )}

            {this.props.modal.practitionerMatches &&
              this.props.modal.practitionerMatches.length > 1 &&
              this.props.modal.practitionerMatches.map((counsel, idx) => (
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

        <div className="usa-form-group">
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend id="representing-legend">
              Who is This Counsel Representing?
            </legend>
            <div className="usa-checkbox">
              <input
                aria-describedby="representing-legend"
                checked={this.props.modal.representingPrimary || false}
                className="usa-checkbox__input"
                id="party-primary"
                name="representingPrimary"
                type="checkbox"
                onChange={e => {
                  this.props.updateModalValueSequence({
                    key: e.target.name,
                    value: e.target.checked,
                  });
                }}
              />
              <label className="usa-checkbox__label" htmlFor="party-primary">
                {this.props.caseDetail.contactPrimary.name}
              </label>
            </div>
            {this.props.caseDetail.contactSecondary &&
              this.props.caseDetail.contactSecondary.name && (
                <div className="usa-checkbox">
                  <input
                    aria-describedby="representing-legend"
                    checked={this.props.modal.representingSecondary || false}
                    className="usa-checkbox__input"
                    id="party-secondary"
                    name="representingSecondary"
                    type="checkbox"
                    onChange={e => {
                      this.props.updateModalValueSequence({
                        key: e.target.name,
                        value: e.target.checked,
                      });
                    }}
                  />
                  <label
                    className="usa-checkbox__label"
                    htmlFor="party-secondary"
                  >
                    {this.props.caseDetail.contactSecondary.name}
                  </label>
                </div>
              )}
          </fieldset>
        </div>
      </div>
    );
  }
}

export const AddPractitionerModal = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    caseDetail: state.formattedCaseDetail,
    confirmSequence: sequences.associatePractitionerWithCaseSequence,
    constants: state.constants,
    modal: state.modal,
    updateModalValueSequence: sequences.updateModalValueSequence,
    validateSequence: sequences.validateAddCounselSequence, //TODO
    validationErrors: state.validationErrors,
  },
  AddPractitionerModalComponent,
);
