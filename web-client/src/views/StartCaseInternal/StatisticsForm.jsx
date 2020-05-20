import { Button } from '../../ustc-ui/Button/Button';
import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import NumberFormat from 'react-number-format';
import React from 'react';

export const StatisticsForm = connect(
  {
    addStatisticToFormSequence: sequences.addStatisticToFormSequence,
    form: state.form,
    showCalculatePenaltiesModalSequence:
      sequences.showCalculatePenaltiesModalSequence,
    statisticsFormHelper: state.statisticsFormHelper,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validationErrors: state.validationErrors,
  },
  function StatisticsForm({
    addStatisticToFormSequence,
    form,
    showCalculatePenaltiesModalSequence,
    statisticsFormHelper,
    updateFormValueSequence,
    validationErrors,
  }) {
    const getDeficiencyAmountInput = index => (
      <>
        <label className="usa-label" htmlFor={`deficiency-amount-${index}`}>
          Deficiency
        </label>
        <NumberFormat
          className="usa-input usa-input-inline"
          decimalScale="2"
          fixedDecimalScale={true}
          id={`deficiency-amount-${index}`}
          isNumericString={true}
          name={`statistics.${index}.deficiencyAmount`}
          prefix="$"
          thousandSeparator={true}
          value={form.statistics[index].deficiencyAmount || ''}
          onValueChange={values => {
            updateFormValueSequence({
              key: `statistics.${index}.deficiencyAmount`,
              value: values.value,
            });
          }}
        />
      </>
    );

    const getTotalPenaltiesInput = index => (
      <>
        <label className="usa-label" htmlFor={`total-penalties-${index}`}>
          Total penalties
        </label>
        <NumberFormat
          className="usa-input usa-input-inline"
          decimalScale="2"
          fixedDecimalScale={true}
          id={`total-penalties-${index}`}
          isNumericString={true}
          name={`statistics.${index}.totalPenalties`}
          prefix="$"
          thousandSeparator={true}
          value={form.statistics[index].totalPenalties || ''}
          onValueChange={values => {
            updateFormValueSequence({
              key: `statistics.${index}.totalPenalties`,
              value: values.value,
            });
          }}
        />
      </>
    );

    const getSingleStatisticForm = index => (
      <React.Fragment key={index}>
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

        <FormGroup
          errorText={statisticsFormHelper.getErrorText(validationErrors, index)}
        >
          {statisticsFormHelper.statisticOptions[index].showYearInput && (
            <div className="grid-row grid-gap-2">
              <div className="grid-col-2">
                <>
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
                </>
              </div>
              <div className="grid-col-4">
                {getDeficiencyAmountInput(index)}
              </div>
              <div className="grid-col-4">{getTotalPenaltiesInput(index)}</div>
            </div>
          )}

          {statisticsFormHelper.statisticOptions[index].showPeriodInput && (
            <>
              <DateInput
                id={`last-date-of-period-${index}`}
                label="Last date of period"
                names={{
                  day: `statistics.${index}.lastDateOfPeriodDay`,
                  month: `statistics.${index}.lastDateOfPeriodMonth`,
                  year: `statistics.${index}.lastDateOfPeriodYear`,
                }}
                values={{
                  day: form.statistics[index].lastDateOfPeriodDay,
                  month: form.statistics[index].lastDateOfPeriodMonth,
                  year: form.statistics[index].lastDateOfPeriodYear,
                }}
                onChange={updateFormValueSequence}
              />
              <div className="grid-row grid-gap-2">
                <div className="grid-col-4">
                  {getDeficiencyAmountInput(index)}
                </div>
                <div className="grid-col-4">
                  {getTotalPenaltiesInput(index)}
                </div>
              </div>
            </>
          )}
        </FormGroup>

        <Button
          link
          className="padding-0"
          icon="calculator"
          onClick={() =>
            showCalculatePenaltiesModalSequence({
              statisticIndex: index,
            })
          }
        >
          Calculate Penalties on IRS Notice
        </Button>

        <hr />
      </React.Fragment>
    );

    return (
      <>
        <h4>
          Statistics Proposed By IRS{' '}
          <span className="usa-hint">(optional)</span>
        </h4>

        {form.statistics.map((statistic, index) =>
          getSingleStatisticForm(index),
        )}

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
