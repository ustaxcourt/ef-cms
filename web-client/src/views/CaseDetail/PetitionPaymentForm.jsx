import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { props, sequences, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const PetitionPaymentForm = connect(
  {
    bind: state[props.bind],
    dateBind: state[props.dateBind],
    navigateBackSequence: sequences.navigateBackSequence,
    paymentStatus: state.constants.PAYMENT_STATUS,
    validationErrors: state[props.validationErrorsBind],
  },
  ({
    bind,
    dateBind,
    paymentStatus,
    updateDateSequence,
    updateSequence,
    validateSequence,
    validationErrors,
  }) => {
    return (
      <>
        <h3 className="margin-bottom-2">Petition Fee</h3>
        <FormGroup>
          <fieldset className="usa-fieldset">
            <legend className="usa-legend" id="fee-paid-legend">
              Fee paid?
            </legend>
            <div className="usa-radio usa-radio__inline">
              <input
                aria-describedby="fee-paid-legend"
                checked={bind.petitionPaymentStatus === paymentStatus.PAID}
                className="usa-radio__input"
                id="payment-status-paid"
                name="petitionPaymentStatus"
                type="radio"
                value={paymentStatus.PAID}
                onChange={e =>
                  updateSequence({
                    key: e.target.name,
                    value: e.target.value,
                  })
                }
              />
              <label className="usa-radio__label" htmlFor="payment-status-paid">
                {paymentStatus.PAID}
              </label>
            </div>

            <div className="usa-radio usa-radio__inline">
              <input
                aria-describedby="fee-paid-legend"
                checked={bind.petitionPaymentStatus === paymentStatus.UNPAID}
                className="usa-radio__input"
                id="payment-status-unpaid"
                name="petitionPaymentStatus"
                type="radio"
                value={paymentStatus.UNPAID}
                onChange={e =>
                  updateSequence({
                    key: e.target.name,
                    value: e.target.value,
                  })
                }
              />
              <label
                className="usa-radio__label"
                htmlFor="payment-status-unpaid"
              >
                {paymentStatus.UNPAID}
              </label>
            </div>

            <div className="usa-radio usa-radio__inline">
              <input
                aria-describedby="fee-paid-legend"
                checked={bind.petitionPaymentStatus === paymentStatus.WAIVED}
                className="usa-radio__input"
                id="payment-status-waived"
                name="petitionPaymentStatus"
                type="radio"
                value={paymentStatus.WAIVED}
                onChange={e =>
                  updateSequence({
                    key: e.target.name,
                    value: e.target.value,
                  })
                }
              />
              <label
                className="usa-radio__label"
                htmlFor="payment-status-waived"
              >
                {paymentStatus.WAIVED}
              </label>
            </div>
          </fieldset>
        </FormGroup>

        {bind.petitionPaymentStatus === paymentStatus.PAID && (
          <>
            <FormGroup errorText={validationErrors.petitionPaymentDate}>
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
                      value={dateBind.paymentDateMonth || ''}
                      onBlur={() => validateSequence()}
                      onChange={e => {
                        updateDateSequence({
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
                      value={dateBind.paymentDateDay || ''}
                      onBlur={() => validateSequence()}
                      onChange={e => {
                        updateDateSequence({
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
                      value={dateBind.paymentDateYear || ''}
                      onBlur={() => validateSequence()}
                      onChange={e => {
                        updateDateSequence({
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
                value={bind.petitionPaymentMethod || ''}
                onBlur={() => validateSequence()}
                onChange={e => {
                  updateSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>
          </>
        )}

        {bind.petitionPaymentStatus === paymentStatus.WAIVED && (
          <FormGroup errorText={validationErrors.petitionPaymentWaivedDate}>
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
                    value={dateBind.paymentDateWaivedMonth || ''}
                    onBlur={() => validateSequence()}
                    onChange={e => {
                      updateDateSequence({
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
                    value={dateBind.paymentDateWaivedDay || ''}
                    onBlur={() => validateSequence()}
                    onChange={e => {
                      updateDateSequence({
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
                    value={dateBind.paymentDateWaivedYear || ''}
                    onBlur={() => validateSequence()}
                    onChange={e => {
                      updateDateSequence({
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
