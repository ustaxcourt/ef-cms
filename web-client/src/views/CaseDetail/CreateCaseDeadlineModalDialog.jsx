import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

class CreateCaseDeadlineModalDialogComponent extends ModalDialog {
  constructor(props) {
    super(props);
    this.modal = {
      cancelLabel: 'Cancel',
      classNames: '',
      confirmLabel: 'Save',
      title: 'Add Deadline',
    };
  }
  renderBody() {
    return (
      <div className="ustc-create-order-modal">
        <div
          className={
            'usa-form-group ' +
            (this.props.validationErrors.deadlineDate
              ? 'usa-form-group--error'
              : '')
          }
        >
          <fieldset className="usa-fieldset margin-bottom-0">
            <legend className="usa-legend" id="deadline-date-legend">
              Due Date
            </legend>
            <div className="usa-memorable-date">
              <div className="usa-form-group usa-form-group--month margin-bottom-0">
                <input
                  aria-describedby="deadline-date-legend"
                  aria-label="month, two digits"
                  className={
                    'usa-input usa-input--inline ' +
                    (this.props.validationErrors.deadlineDate
                      ? 'usa-input--error'
                      : '')
                  }
                  id="deadline-date-month"
                  max="12"
                  min="1"
                  name="month"
                  placeholder="MM"
                  type="number"
                  value={this.props.form.month || ''}
                  onChange={e => {
                    this.props.updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                    this.props.validateCaseDeadlineSequence();
                  }}
                />
              </div>
              <div className="usa-form-group usa-form-group--day margin-bottom-0">
                <input
                  aria-describedby="deadline-date-legend"
                  aria-label="day, two digits"
                  className={
                    'usa-input usa-input--inline ' +
                    (this.props.validationErrors.deadlineDate
                      ? 'usa-input--error'
                      : '')
                  }
                  id="deadline-date-day"
                  max="31"
                  min="1"
                  name="day"
                  placeholder="DD"
                  type="number"
                  value={this.props.form.day || ''}
                  onChange={e => {
                    this.props.updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                    this.props.validateCaseDeadlineSequence();
                  }}
                />
              </div>
              <div className="usa-form-group usa-form-group--year margin-bottom-0">
                <input
                  aria-describedby="deadline-date-legend"
                  aria-label="year, four digits"
                  className={
                    'usa-input usa-input--inline ' +
                    (this.props.validationErrors.deadlineDate
                      ? 'usa-input--error'
                      : '')
                  }
                  id="deadline-date-year"
                  max="2100"
                  min="1900"
                  name="year"
                  placeholder="YYYY"
                  type="number"
                  value={this.props.form.year || ''}
                  onChange={e => {
                    this.props.updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                    this.props.validateCaseDeadlineSequence();
                  }}
                />
              </div>
            </div>
          </fieldset>
          {this.props.validationErrors.deadlineDate && (
            <div className="usa-error-message beneath">
              {this.props.validationErrors.deadlineDate}
            </div>
          )}
        </div>

        <div
          className={
            'usa-form-group ' +
            (this.props.validationErrors.description
              ? 'usa-form-group--error'
              : '')
          }
        >
          <label className="usa-label" htmlFor="description">
            What is this deadline for?
          </label>
          <textarea
            className="usa-textarea"
            id="description"
            maxLength="120"
            name="description"
            type="text"
            onChange={e => {
              this.props.updateFormValueSequence({
                key: e.target.name,
                value: e.target.value,
              });
              this.props.validateCaseDeadlineSequence();
            }}
          />
          {this.props.validationErrors.description && (
            <div className="usa-error-message beneath">
              {this.props.validationErrors.description}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export const CreateCaseDeadlineModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.createCaseDeadlineSequence,
    constants: state.constants,
    form: state.form,
    modal: state.modal,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateCaseDeadlineSequence: sequences.validateCaseDeadlineSequence,
    validationErrors: state.validationErrors,
  },
  CreateCaseDeadlineModalDialogComponent,
);
