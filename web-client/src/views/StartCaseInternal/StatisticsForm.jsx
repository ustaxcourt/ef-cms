import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const StatisticsForm = connect(
  {
    form: state.form,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function StatisticsForm({ form, updateFormValueSequence, validationErrors }) {
    return (
      <>
        <h4>
          Statistics Proposed By IRS{' '}
          <span className="usa-hint">(optional)</span>
        </h4>

        <FormGroup errorText={validationErrors.yearOrPeriod}>
          <fieldset className="usa-fieldset">
            {['Year', 'Period'].map(option => (
              <div className="usa-radio usa-radio__inline" key={option}>
                <input
                  checked={form.yearOrPeriod === option}
                  className="usa-radio__input"
                  id={`year-or-period-${option}`}
                  name="yearOrPeriod"
                  type="radio"
                  value={option}
                  onChange={e => {
                    updateFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                  }}
                />
                <label
                  className="usa-radio__label"
                  htmlFor={`year-or-period-${option}`}
                >
                  {option}
                </label>
              </div>
            ))}
          </fieldset>
        </FormGroup>

        <div className="grid-row grid-gap-2">
          <div className="grid-col-2">
            <FormGroup errorText={validationErrors.year}>
              <label className="usa-label" htmlFor="year">
                Year
              </label>
              <input
                className="usa-input usa-input-inline"
                id="year"
                maxLength="25"
                name="year"
                placeholder="YYYY"
                value={form.year || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>
          </div>
          <div className="grid-col-4">
            <FormGroup errorText={validationErrors.deficiencyAmount}>
              <label className="usa-label" htmlFor="deficiencyAmount">
                Decifiency
              </label>
              <input
                className="usa-input usa-input-inline"
                id="deficiencyAmount"
                maxLength="25"
                name="deficiencyAmount"
                value={form.deficiencyAmount || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>
          </div>
          <div className="grid-col-4">
            <FormGroup errorText={validationErrors.totalPenalties}>
              <label className="usa-label" htmlFor="totalPenalties">
                Total penalties
              </label>
              <input
                className="usa-input usa-input-inline"
                id="totalPenalties"
                maxLength="25"
                name="totalPenalties"
                value={form.totalPenalties || ''}
                onChange={e => {
                  updateFormValueSequence({
                    key: e.target.name,
                    value: e.target.value,
                  });
                }}
              />
            </FormGroup>
          </div>
        </div>

        <Button link className="padding-0" icon="calculator">
          Calculate Penalties on IRS Notice
        </Button>

        <hr />

        <Button secondary icon="plus-circle">
          Add Another Year/Period
        </Button>
      </>
    );
  },
);
