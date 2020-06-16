import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { props, state } from 'cerebral';
import React from 'react';
import classNames from 'classnames';

export const PetitionPaymentForm = connect(
  {
    bind: state[props.bind],
    dateBind: state[props.dateBind],
    paymentStatus: state.constants.PAYMENT_STATUS,
    validationErrors: state[props.validationErrorsBind],
  },
  function PetitionPaymentForm({
    bind,
    dateBind,
    paymentStatus,
    updateDateSequence,
    updateSequence,
    validateSequence,
    validationErrors,
  }) {
    return (
      <>
        <h4 className="margin-bottom-2">Petition Fee</h4>
        <FormGroup errorText={validationErrors.petitionPaymentStatus}>
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
                onChange={e => {
                  updateSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateSequence();
                }}
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
                onChange={e => {
                  updateSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateSequence();
                }}
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
                onChange={e => {
                  updateSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                  validateSequence();
                }}
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
            <DateInput
              errorText={validationErrors.petitionPaymentDate}
              id="payment-date"
              label="Payment date"
              names={{
                day: 'paymentDateDay',
                month: 'paymentDateMonth',
                year: 'paymentDateYear',
              }}
              values={{
                day: dateBind.paymentDateDay,
                month: dateBind.paymentDateMonth,
                year: dateBind.paymentDateYear,
              }}
              onBlur={validateSequence}
              onChange={updateDateSequence}
            />

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
          <DateInput
            errorText={validationErrors.petitionPaymentWaivedDate}
            id="payment-date-waived"
            label="Date waived"
            names={{
              day: 'paymentDateWaivedDay',
              month: 'paymentDateWaivedMonth',
              year: 'paymentDateWaivedYear',
            }}
            values={{
              day: dateBind.paymentDateWaivedDay,
              month: dateBind.paymentDateWaivedMonth,
              year: dateBind.paymentDateWaivedYear,
            }}
            onBlur={validateSequence}
            onChange={updateDateSequence}
          />
        )}
      </>
    );
  },
);
