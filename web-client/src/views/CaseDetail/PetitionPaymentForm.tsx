import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { props } from 'cerebral';
import { sequences, state } from '@web-client/presenter/app.cerebral';
import React from 'react';
import classNames from 'classnames';

export const PetitionPaymentForm = connect(
  {
    DATE_FORMATS: state.constants.DATE_FORMATS,
    bind: state[props.bind],
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
    paymentStatus: state.constants.PAYMENT_STATUS,
    validationErrors: state[props.validationErrorsBind],
  },
  function PetitionPaymentForm({
    bind,
    DATE_FORMATS,
    formatAndUpdateDateFromDatePickerSequence,
    paymentStatus,
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
                data-testid="payment-status-unpaid-label"
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
            <DateSelector
              defaultValue={bind.petitionPaymentDate}
              errorText={validationErrors.petitionPaymentDate}
              id="payment-date"
              label="Payment date"
              onChange={e => {
                formatAndUpdateDateFromDatePickerSequence({
                  key: 'petitionPaymentDate',
                  toFormat: DATE_FORMATS.ISO,
                  value: e.target.value,
                });
                validateSequence();
              }}
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
          <DateSelector
            defaultValue={bind.petitionPaymentWaivedDate}
            errorText={validationErrors.petitionPaymentWaivedDate}
            id="payment-date-waived"
            label="Date waived"
            onChange={e => {
              formatAndUpdateDateFromDatePickerSequence({
                key: 'petitionPaymentWaivedDate',
                toFormat: DATE_FORMATS.ISO,
                value: e.target.value,
              });
              validateSequence();
            }}
          />
        )}
      </>
    );
  },
);

PetitionPaymentForm.displayName = 'PetitionPaymentForm';
