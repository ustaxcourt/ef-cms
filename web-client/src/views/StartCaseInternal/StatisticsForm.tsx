import { Button } from '../../ustc-ui/Button/Button';
import { DateSelector } from '@web-client/ustc-ui/DateInput/DateSelector';
import { DollarsInput } from '../../ustc-ui/DollarsInput/DollarsInput';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@web-client/presenter/shared.cerebral';
import { sequences } from '@web-client/presenter/app.cerebral';
import { state } from '@web-client/presenter/app.cerebral';
import React from 'react';

export const StatisticsForm = connect(
  {
    DATE_FORMATS: state.constants.DATE_FORMATS,
    addStatisticToFormSequence: sequences.addStatisticToFormSequence,
    checkForNegativeValueSequence: sequences.checkForNegativeValueSequence,
    confirmationText: state.confirmationText,
    form: state.form,
    formatAndUpdateDateFromDatePickerSequence:
      sequences.formatAndUpdateDateFromDatePickerSequence,
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
    checkForNegativeValueSequence,
    confirmationText,
    DATE_FORMATS,
    form,
    formatAndUpdateDateFromDatePickerSequence,
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
          data-testid={`deficiency-amount-${index}`}
          id={`deficiency-amount-${index}`}
          name={`statistics.${index}.irsDeficiencyAmount`}
          value={form.statistics[index].irsDeficiencyAmount || ''}
          onBlur={() => validatePetitionFromPaperSequence()}
          onValueChange={values => {
            updateStatisticsFormValueSequence({
              key: `statistics.${index}.irsDeficiencyAmount`,
              value: values.value,
            });
            checkForNegativeValueSequence({
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
          disabled
          className="usa-input usa-input-inline"
          id={`total-penalties-${index}`}
          name={`statistics.${index}.irsTotalPenalties`}
          value={form.statistics[index].irsTotalPenalties || ''}
        />
      </>
    );

    const getSingleStatisticForm = (index, statistic) => (
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
          confirmationText={
            confirmationText?.statistics[index]?.irsDeficiencyAmount
          }
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
              <DateSelector
                defaultValue={form.statistics[index].lastDateOfPeriod}
                errorText={validationErrors.lastDateOfPeriod}
                id={`last-date-of-period-${index}`}
                label="Last date of period"
                onChange={e => {
                  formatAndUpdateDateFromDatePickerSequence({
                    key: `statistics.${index}.lastDateOfPeriod`,
                    toFormat: DATE_FORMATS.ISO,
                    value: e.target.value,
                  });
                  validatePetitionFromPaperSequence();
                }}
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
              key: 'irsTotalPenalties',
              statisticId: statistic.statisticId,
              statisticIndex: index,
              subkey: 'irsPenaltyAmount',
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
          getSingleStatisticForm(index, statistic),
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

StatisticsForm.displayName = 'StatisticsForm';
