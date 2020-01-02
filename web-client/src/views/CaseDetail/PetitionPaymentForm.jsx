import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';

import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const PetitionPaymentForm = connect(
  {
    form: state.form,
    navigateBackSequence: sequences.navigateBackSequence,
    paymentStatus: state.constants.PAYMENT_STATUS,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validatePetitionFeePaymentSequence:
      sequences.validatePetitionFeePaymentSequence,
    validationErrors: state.validationErrors,
  },
  ({
    form,
    paymentStatus,
    updateFormValueSequence,
    validatePetitionFeePaymentSequence,
    validationErrors,
  }) => {
    return (
      <>
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
            <FormGroup errorText={validationErrors.paymentDate}>
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
                        validationErrors.paymentDate && 'usa-input-error',
                      )}
                      id="payment-date-month"
                      max="12"
                      min="1"
                      name="paymentDateMonth"
                      placeholder="MM"
                      type="number"
                      value={form.paymentDateMonth || ''}
                      onBlur={() => validatePetitionFeePaymentSequence()}
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
                        validationErrors.paymentDate && 'usa-input-error',
                      )}
                      id="payment-date-day"
                      max="31"
                      min="1"
                      name="paymentDateDay"
                      placeholder="DD"
                      type="number"
                      value={form.paymentDateDay || ''}
                      onBlur={() => validatePetitionFeePaymentSequence()}
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
                        validationErrors.paymentDate && 'usa-input-error',
                      )}
                      id="payment-date-year"
                      name="paymentDateYear"
                      placeholder="YYYY"
                      type="number"
                      value={form.paymentDateYear || ''}
                      onBlur={() => validatePetitionFeePaymentSequence()}
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
                onBlur={() => validatePetitionFeePaymentSequence()}
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
          <FormGroup errorText={validationErrors.paymentDateWaived}>
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
                      validationErrors.paymentDateWaived && 'usa-input-error',
                    )}
                    id="payment-date-waived-month"
                    max="12"
                    min="1"
                    name="paymentDateWaivedMonth"
                    placeholder="MM"
                    type="number"
                    value={form.paymentDateWaivedMonth || ''}
                    onBlur={() => validatePetitionFeePaymentSequence()}
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
                      validationErrors.paymentDateWaived && 'usa-input-error',
                    )}
                    id="payment-date-waived-day"
                    max="31"
                    min="1"
                    name="paymentDateWaivedDay"
                    placeholder="DD"
                    type="number"
                    value={form.paymentDateWaivedDay || ''}
                    onBlur={() => validatePetitionFeePaymentSequence()}
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
                      validationErrors.paymentDateWaived && 'usa-input-error',
                    )}
                    id="payment-date-waived-year"
                    name="paymentDateWaivedYear"
                    placeholder="YYYY"
                    type="number"
                    value={form.paymentDateWaivedYear || ''}
                    onBlur={() => validatePetitionFeePaymentSequence()}
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
      </>
    );
  },
);
