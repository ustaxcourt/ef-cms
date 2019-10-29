import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { ModalDialog } from '../ModalDialog';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const EditCaseDeadlineModalDialog = connect(
  {
    cancelSequence: sequences.dismissModalSequence,
    confirmSequence: sequences.updateCaseDeadlineSequence,
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateCaseDeadlineSequence: sequences.validateCaseDeadlineSequence,
    validationErrors: state.validationErrors,
  },
  ({
    cancelSequence,
    confirmSequence,
    form,
    updateFormValueSequence,
    validateCaseDeadlineSequence,
    validationErrors,
  }) => {
    return (
      <ModalDialog
        cancelLabel="Cancel"
        cancelSequence={cancelSequence}
        className=""
        confirmLabel="Save"
        confirmSequence={confirmSequence}
        title="Edit Deadline"
      >
        <div className="ustc-create-order-modal">
          <FormGroup errorText={validationErrors.deadlineDate}>
            <fieldset className="usa-fieldset margin-bottom-0">
              <legend className="usa-legend" id="deadline-date-legend">
                Due date
              </legend>
              <div className="usa-memorable-date">
                <div className="usa-form-group usa-form-group--month margin-bottom-0">
                  <input
                    aria-describedby="deadline-date-legend"
                    aria-label="month, two digits"
                    className={classNames(
                      'usa-input usa-input--inline',
                      validationErrors.deadlineDate && 'usa-input--error',
                    )}
                    id="deadline-date-month"
                    max="12"
                    min="1"
                    name="month"
                    placeholder="MM"
                    type="number"
                    value={form.month || ''}
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                      validateCaseDeadlineSequence();
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group--day margin-bottom-0">
                  <input
                    aria-describedby="deadline-date-legend"
                    aria-label="day, two digits"
                    className={classNames(
                      'usa-input usa-input--inline',
                      validationErrors.deadlineDate && 'usa-input--error',
                    )}
                    id="deadline-date-day"
                    max="31"
                    min="1"
                    name="day"
                    placeholder="DD"
                    type="number"
                    value={form.day || ''}
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                      validateCaseDeadlineSequence();
                    }}
                  />
                </div>
                <div className="usa-form-group usa-form-group--year margin-bottom-0">
                  <input
                    aria-describedby="deadline-date-legend"
                    aria-label="year, four digits"
                    className={classNames(
                      'usa-input usa-input--inline',
                      validationErrors.deadlineDate && 'usa-input--error',
                    )}
                    id="deadline-date-year"
                    max="2100"
                    min="1900"
                    name="year"
                    placeholder="YYYY"
                    type="number"
                    value={form.year || ''}
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                      validateCaseDeadlineSequence();
                    }}
                  />
                </div>
              </div>
            </fieldset>
          </FormGroup>

          <FormGroup errorText={validationErrors.description}>
            <label className="usa-label" htmlFor="description">
              What is this deadline for?
            </label>
            <textarea
              className="usa-textarea"
              id="description"
              maxLength="120"
              name="description"
              type="text"
              value={form.description}
              onChange={e => {
                updateFormValueSequence({
                  key: e.target.name,
                  value: e.target.value,
                });
                validateCaseDeadlineSequence();
              }}
            />
          </FormGroup>
        </div>
      </ModalDialog>
    );
  },
);
