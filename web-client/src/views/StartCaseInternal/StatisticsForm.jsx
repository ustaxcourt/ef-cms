import { Button } from '../../ustc-ui/Button/Button';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

const SingleStatisticForm = ({
  form,
  index,
  updateFormValueSequence,
  validationErrors,
}) => {
  return (
    <>
      <FormGroup>
        <fieldset className="usa-fieldset">
          {['Year', 'Period'].map(option => (
            <div className="usa-radio usa-radio__inline" key={option}>
              <input
                checked={form.statistics[index].yearOrPeriod === option}
                className="usa-radio__input"
                id={`year-or-period-${index}-${option}`}
                name={`statistics.${index}.yearOrPeriod`}
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
                htmlFor={`year-or-period-${index}-${option}`}
              >
                {option}
              </label>
            </div>
          ))}
        </fieldset>
      </FormGroup>

      <div className="grid-row grid-gap-2">
        <div className="grid-col-2">
          <FormGroup
            errorText={
              validationErrors.statistics &&
              validationErrors.statistics[index] &&
              validationErrors.statistics[index].year
            }
          >
            <label className="usa-label" htmlFor={`year-${index}`}>
              Year
            </label>
            <input
              className="usa-input usa-input-inline"
              id={`year-${index}`}
              maxLength="25"
              name={`statistics.${index}.year`}
              placeholder="YYYY"
              value={form.statistics[index].year || ''}
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
          <FormGroup
            errorText={
              validationErrors.statistics &&
              validationErrors.statistics[index] &&
              validationErrors.statistics[index].deficiencyAmount
            }
          >
            <label className="usa-label" htmlFor={`deficiency-amount-${index}`}>
              Decifiency
            </label>
            <input
              className="usa-input usa-input-inline"
              id={`deficiency-amount-${index}`}
              maxLength="25"
              name={`statistics.${index}.deficiencyAmount`}
              value={form.statistics[index].deficiencyAmount || ''}
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
          <FormGroup
            errorText={
              validationErrors.statistics &&
              validationErrors.statistics[index] &&
              validationErrors.statistics[index].totalPenalties
            }
          >
            <label className="usa-label" htmlFor={`total-penalties-${index}`}>
              Total penalties
            </label>
            <input
              className="usa-input usa-input-inline"
              id={`total-penalties-${index}`}
              maxLength="25"
              name={`statistics.${index}.totalPenalties`}
              value={form.statistics[index].totalPenalties || ''}
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
    </>
  );
};

export const StatisticsForm = connect(
  {
    addStatisticToFormSequence: sequences.addStatisticToFormSequence,
    form: state.form,
    statisticsFormHelper: state.statisticsFormHelper,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function StatisticsForm({
    addStatisticToFormSequence,
    form,
    statisticsFormHelper,
    updateFormValueSequence,
    validationErrors,
  }) {
    return (
      <>
        <h4>
          Statistics Proposed By IRS{' '}
          <span className="usa-hint">(optional)</span>
        </h4>

        {form.statistics.map((statistic, index) => (
          <SingleStatisticForm
            form={form}
            index={index}
            key={index}
            updateFormValueSequence={updateFormValueSequence}
            validationErrors={validationErrors}
          />
        ))}

        {statisticsFormHelper.showAddMoreStatisticsButton && (
          <Button
            secondary
            icon="plus-circle"
            onClick={() => addStatisticToFormSequence()}
          >
            Add Another Year/Period
          </Button>
        )}
      </>
    );
  },
);
