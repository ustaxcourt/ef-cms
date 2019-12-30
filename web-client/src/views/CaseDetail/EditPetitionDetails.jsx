import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';

import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const EditPetitionDetails = connect(
  {
    cancelEditPetitionDetailsSequence:
      sequences.cancelEditPetitionDetailsSequence,
    caseDetail: state.caseDetail,
    form: state.form,
    navigateBackSequence: sequences.navigateBackSequence,
    paymentStatus: state.constants.PAYMENT_STATUS,
    updateFormValueSequence: sequences.updateFormValueSequence,
    updatePetitionFeePaymentSequence:
      sequences.updatePetitionFeePaymentSequence,
    validationErrors: state.validationErrors,
  },
  ({
    cancelEditPetitionDetailsSequence,
    caseDetail,
    form,
    paymentStatus,
    updateFormValueSequence,
    updatePetitionFeePaymentSequence,
    validationErrors,
  }) => {
    return (
      <>
        <h1>Edit Petition Details</h1>
        <div className="blue-container margin-bottom-4">
          {/* TODO: should we wrap this in a form */}
          <h3 className="margin-bottom-2">Petition Fee</h3>
          <FormGroup errorText={''}>
            <fieldset className="usa-fieldset">
              <legend className="usa-legend">Fee paid?</legend>
              <div className="usa-radio usa-radio__inline">
                <input
                  checked={form.petitionPaymentStatus === paymentStatus.PAID}
                  className="usa-radio__input"
                  id="payment-status-paid"
                  name="petitionPaymentStatus"
                  type="radio"
                  value={paymentStatus.PAID}
                  onChange={e =>
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    })
                  }
                />
                <label
                  className="usa-radio__label"
                  htmlFor={'payment-status-paid'}
                >
                  {paymentStatus.PAID}
                </label>
              </div>

              <div className="usa-radio usa-radio__inline">
                <input
                  checked={form.petitionPaymentStatus === paymentStatus.UNPAID}
                  className="usa-radio__input"
                  id="payment-status-unpaid"
                  name="petitionPaymentStatus"
                  type="radio"
                  value={paymentStatus.UNPAID}
                  onChange={e =>
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    })
                  }
                />
                <label
                  className="usa-radio__label"
                  htmlFor={'payment-status-unpaid'}
                >
                  {paymentStatus.UNPAID}
                </label>
              </div>

              <div className="usa-radio usa-radio__inline">
                <input
                  checked={form.petitionPaymentStatus === paymentStatus.WAIVED}
                  className="usa-radio__input"
                  id="payment-status-waived"
                  name="petitionPaymentStatus"
                  type="radio"
                  value={paymentStatus.WAIVED}
                  onChange={e =>
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    })
                  }
                />
                <label
                  className="usa-radio__label"
                  htmlFor={'payment-status-waived'}
                >
                  {paymentStatus.WAIVED}
                </label>
              </div>
            </fieldset>
          </FormGroup>

          {form.petitionPaymentStatus === paymentStatus.PAID && (
            <>
              <FormGroup
                errorText={
                  validationErrors.paymentDateMonth ||
                  validationErrors.paymentDateDay ||
                  validationErrors.paymentDateYear
                }
              >
                <fieldset className="usa-fieldset margin-bottom-0">
                  <legend className="usa-legend" id="payment-date-legend">
                    Payment date
                  </legend>
                  <div className="usa-memorable-date">
                    <div className="usa-form-group usa-form-group--month margin-bottom-0">
                      <input
                        aria-describedby="payment-date-legend"
                        aria-label="month, two digits"
                        className={classNames(
                          'usa-input usa-input--inline',
                          validationErrors.paymentDateMonth &&
                            'usa-input-error',
                        )}
                        id="payment-date-month"
                        max="12"
                        min="1"
                        name="paymentDateMonth"
                        placeholder="MM"
                        type="number"
                        value={form.paymentDateMonth || ''}
                        // onBlur={() => validateCaseDetailSequence()}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="usa-form-group usa-form-group--day margin-bottom-0">
                      <input
                        aria-describedby="payment-date-legend"
                        aria-label="day, two digits"
                        className={classNames(
                          'usa-input usa-input--inline',
                          validationErrors.paymentDateDay && 'usa-input-error',
                        )}
                        id="payment-date-day"
                        max="31"
                        min="1"
                        name="paymentDateDay"
                        placeholder="DD"
                        type="number"
                        value={form.paymentDateDay || ''}
                        // onBlur={() => validateCaseDetailSequence()}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                    </div>
                    <div className="usa-form-group usa-form-group--year margin-bottom-0">
                      <input
                        aria-describedby="payment-date-legend"
                        aria-label="year, four digits"
                        className={classNames(
                          'usa-input usa-input--inline',
                          validationErrors.paymentDateYear && 'usa-input-error',
                        )}
                        id="payment-date-year"
                        name="paymentDateYear"
                        placeholder="YYYY"
                        type="number"
                        value={form.paymentDateYear || ''}
                        // onBlur={() => validateCaseDetailSequence()}
                        onChange={e => {
                          updateFormValueSequence({
                            key: e.target.name,
                            value: e.target.value,
                          });
                        }}
                      />
                    </div>
                  </div>
                </fieldset>
              </FormGroup>

              <FormGroup errorText={validationErrors.petitionPaymentMethod}>
                <label className="usa-label" htmlFor="petition-payment-method">
                  Payment method
                </label>
                <input
                  className={classNames(
                    'usa-input',
                    validationErrors.petitionPaymentMethod && 'usa-input-error',
                  )}
                  id="petition-payment-method"
                  name="petitionPaymentMethod"
                  value={form.petitionPaymentMethod || ''}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
              </FormGroup>
            </>
          )}

          {form.petitionPaymentStatus === paymentStatus.WAIVED && (
            <FormGroup
              errorText={
                validationErrors.paymentDateWaivedMonth ||
                validationErrors.paymentDateWaivedDay ||
                validationErrors.paymentDateWaivedYear
              }
            >
              <fieldset className="usa-fieldset margin-bottom-0">
                <legend className="usa-legend" id="payment-date-waived-legend">
                  Date waived
                </legend>
                <div className="usa-memorable-date">
                  <div className="usa-form-group usa-form-group--month margin-bottom-0">
                    <input
                      aria-describedby="payment-date-waived-legend"
                      aria-label="month, two digits"
                      className={classNames(
                        'usa-input usa-input--inline',
                        validationErrors.paymentDateWaivedMonth &&
                          'usa-input-error',
                      )}
                      id="payment-date-waived-month"
                      max="12"
                      min="1"
                      name="paymentDateWaivedMonth"
                      placeholder="MM"
                      type="number"
                      value={form.paymentDateWaivedMonth || ''}
                      // onBlur={() => validateCaseDetailSequence()}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="usa-form-group usa-form-group--day margin-bottom-0">
                    <input
                      aria-describedby="payment-date-waived-legend"
                      aria-label="day, two digits"
                      className={classNames(
                        'usa-input usa-input--inline',
                        validationErrors.paymentDateWaivedDay &&
                          'usa-input-error',
                      )}
                      id="payment-date-waived-day"
                      max="31"
                      min="1"
                      name="paymentDateWaivedDay"
                      placeholder="DD"
                      type="number"
                      value={form.paymentDateWaivedDay || ''}
                      // onBlur={() => validateCaseDetailSequence()}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </div>
                  <div className="usa-form-group usa-form-group--year margin-bottom-0">
                    <input
                      aria-describedby="payment-date-waived-legend"
                      aria-label="year, four digits"
                      className={classNames(
                        'usa-input usa-input--inline',
                        validationErrors.paymentDateWaivedYear &&
                          'usa-input-error',
                      )}
                      id="payment-date-waived-year"
                      name="paymentDateWaivedYear"
                      placeholder="YYYY"
                      type="number"
                      value={form.paymentDateWaivedYear || ''}
                      // onBlur={() => validateCaseDetailSequence()}
                      onChange={e => {
                        updateFormValueSequence({
                          key: e.target.name,
                          value: e.target.value,
                        });
                      }}
                    />
                  </div>
                </div>
              </fieldset>
            </FormGroup>
          )}
        </div>

        <Button
          onClick={() => {
            updatePetitionFeePaymentSequence();
          }}
        >
          Save
        </Button>

        <Button link onClick={() => cancelEditPetitionDetailsSequence()}>
          Cancel
        </Button>
      </>
    );
  },
);
