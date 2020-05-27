import { Button } from '../../ustc-ui/Button/Button';
import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { DollarsInput } from '../../ustc-ui/DollarsInput/DollarsInput';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const StatisticsForm = connect(
  {
    addStatisticToFormSequence: sequences.addStatisticToFormSequence,
    form: state.form,
    showCalculatePenaltiesModalSequence:
      sequences.showCalculatePenaltiesModalSequence,
    statisticsFormHelper: state.statisticsFormHelper,
    updateStatisticsFormValueSequence:
      sequences.updateStatisticsFormValueSequence,
    validatePetitionFromPaperSequence:
      sequences.validatePetitionFromPaperSequence,
    validationErrors: state.validationErrors,
  },
  function StatisticsForm({
    addStatisticToFormSequence,
    form,
    showCalculatePenaltiesModalSequence,
    statisticsFormHelper,
    updateStatisticsFormValueSequence,
    validatePetitionFromPaperSequence,
    validationErrors,
  }) {
    const getDeficiencyAmountInput = index => (
      <>
        <label className="usa-label" htmlFor={`deficiency-amount-${index}`}>
          Deficiency
        </label>
        <DollarsInput
          className="usa-input usa-input-inline"
          id={`deficiency-amount-${index}`}
          name={`statistics.${index}.irsDeficiencyAmount`}
          value={form.statistics[index].irsDeficiencyAmount || ''}
          onBlur={() => validatePetitionFromPaperSequence()}
          onValueChange={values => {
            updateStatisticsFormValueSequence({
              key: `statistics.${index}.irsDeficiencyAmount`,
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
        <DollarsInput
          className="usa-input usa-input-inline"
          id={`total-penalties-${index}`}
          name={`statistics.${index}.irsTotalPenalties`}
          value={form.statistics[index].irsTotalPenalties || ''}
          onBlur={() => validatePetitionFromPaperSequence()}
          onValueChange={values => {
            updateStatisticsFormValueSequence({
              key: `statistics.${index}.irsTotalPenalties`,
              value: values.value,
            });
          }}
        />
      </>
    );

    const getSingleStatisticForm = index => (
      <div className="statistic-form" key={index}>
        <FormGroup>
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
                  updateStatisticsFormValueSequence({
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
        </FormGroup>

        <FormGroup
          errorText={
            validationErrors.statistics &&
            validationErrors.statistics[index] &&
            validationErrors.statistics[index].enterAllValues
          }
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
                    maxLength="4"
                    name={`statistics.${index}.year`}
                    placeholder="YYYY"
                    value={form.statistics[index].year || ''}
                    onBlur={() => validatePetitionFromPaperSequence()}
                    onChange={e => {
                      updateStatisticsFormValueSequence({
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
                onBlur={() => validatePetitionFromPaperSequence()}
                onChange={updateStatisticsFormValueSequence}
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
          className="padding-0 calculate-penalties"
          icon="calculator"
          onClick={() =>
            showCalculatePenaltiesModalSequence({
              statisticIndex: index,
              title: 'Calculate Penalties on IRS Notice',
            })
          }
        >
          Calculate Penalties on IRS Notice
        </Button>

        <hr />
      </div>
    );

    return (
      <>
        <h4>Statistics Proposed By IRS</h4>

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
