import { Button } from '../../ustc-ui/Button/Button';
import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { DollarsInput } from '../../ustc-ui/DollarsInput/DollarsInput';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const DeficiencyStatisticsForm = connect(
  {
    form: state.form,
    showCalculatePenaltiesModalSequence:
      sequences.showCalculatePenaltiesModalSequence,
    updateAddDeficiencyFormValueSequence:
      sequences.updateAddDeficiencyFormValueSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
    validateAddDeficiencyStatisticsSequence:
      sequences.validateAddDeficiencyStatisticsSequence,
    validationErrors: state.validationErrors,
  },
  function DeficiencyStatisticsForm({
    form,
    showCalculatePenaltiesModalSequence,
    updateAddDeficiencyFormValueSequence,
    updateFormValueSequence,
    validateAddDeficiencyStatisticsSequence,
    validationErrors,
  }) {
    return (
      <>
        <div className="margin-bottom-0">
          <label className="usa-label" htmlFor="year-or-period">
            Select Year or period
          </label>

          <FormGroup id="year-or-period">
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
                    updateAddDeficiencyFormValueSequence({
                      key: e.target.name,
                      value: e.target.value,
                    });
                    validateAddDeficiencyStatisticsSequence();
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
          </FormGroup>

          <div className="grid-row grid-gap-4">
            <div className="grid-col-3">
              {form.yearOrPeriod === 'Year' && (
                <FormGroup errorText={validationErrors.year}>
                  <label className="usa-label" htmlFor="year">
                    Year
                  </label>
                  <input
                    className="usa-input usa-input-inline year-small"
                    id="year"
                    maxLength="4"
                    name="year"
                    placeholder="YYYY"
                    value={form.year || ''}
                    onBlur={() => validateAddDeficiencyStatisticsSequence()}
                    onChange={e => {
                      updateFormValueSequence({
                        key: e.target.name,
                        value: e.target.value,
                      });
                    }}
                  />
                </FormGroup>
              )}

              {form.yearOrPeriod === 'Period' && (
                <FormGroup errorText={validationErrors.lastDateOfPeriod}>
                  <DateInput
                    id="last-date-of-period"
                    label="Last date of period"
                    names={{
                      day: 'lastDateOfPeriodDay',
                      month: 'lastDateOfPeriodMonth',
                      year: 'lastDateOfPeriodYear',
                    }}
                    values={{
                      day: form.lastDateOfPeriodDay,
                      month: form.lastDateOfPeriodMonth,
                      year: form.lastDateOfPeriodYear,
                    }}
                    onBlur={() => validateAddDeficiencyStatisticsSequence()}
                    onChange={({ key, value }) => {
                      updateFormValueSequence({
                        key,
                        value,
                      });
                    }}
                  />
                </FormGroup>
              )}
            </div>
          </div>

          <div className="grid-row grid-gap-2">
            <div className="grid-col-3">
              <FormGroup errorText={validationErrors.irsDeficiencyAmount}>
                <label className="usa-label" htmlFor="irs-deficiency-amount">
                  Deficiency (IRS Notice)
                </label>
                <DollarsInput
                  className="usa-input usa-input-inline input-medium"
                  id="irs-deficiency-amount"
                  name="irsDeficiencyAmount"
                  value={form.irsDeficiencyAmount || ''}
                  onBlur={() => validateAddDeficiencyStatisticsSequence()}
                  onValueChange={values => {
                    updateFormValueSequence({
                      key: 'irsDeficiencyAmount',
                      value: values.value,
                    });
                  }}
                />
              </FormGroup>
            </div>

            <div className="grid-col-3">
              <FormGroup errorText={validationErrors.irsTotalPenalties}>
                <label className="usa-label" htmlFor="irs-total-penalties">
                  Total penalties (IRS Notice)
                </label>
                <DollarsInput
                  className="usa-input usa-input-inline input-medium"
                  id="irs-total-penalties"
                  name="irsTotalPenalties"
                  value={form.irsTotalPenalties || ''}
                  onBlur={() => validateAddDeficiencyStatisticsSequence()}
                  onValueChange={values => {
                    updateFormValueSequence({
                      key: 'irsTotalPenalties',
                      value: values.value,
                    });
                  }}
                />
                <Button
                  link
                  className="padding-0 calculate-penalties"
                  icon="calculator"
                  onClick={() =>
                    showCalculatePenaltiesModalSequence({
                      key: 'irsTotalPenalties',
                      title: 'Calculate Penalties on IRS Notice',
                    })
                  }
                >
                  Calculate penalties on IRS Notice
                </Button>
              </FormGroup>
            </div>
          </div>

          <div className="grid-row grid-gap-2">
            <div className="grid-col-3">
              <FormGroup
                errorText={validationErrors.determinationDeficiencyAmount}
              >
                <label
                  className="usa-label"
                  htmlFor="determination-deficiency-amount"
                >
                  Deficiency (Determination)
                </label>
                <DollarsInput
                  className="usa-input usa-input-inline input-medium"
                  id="determination-deficiency-amount"
                  name="determinationDeficiencyAmount"
                  value={form.determinationDeficiencyAmount || ''}
                  onBlur={() => validateAddDeficiencyStatisticsSequence()}
                  onValueChange={values => {
                    updateFormValueSequence({
                      key: 'determinationDeficiencyAmount',
                      value: values.value,
                    });
                  }}
                />
              </FormGroup>
            </div>

            <div className="grid-col-3">
              <FormGroup
                errorText={validationErrors.determinationTotalPenalties}
              >
                <label
                  className="usa-label"
                  htmlFor="determination-total-penalties"
                >
                  Total penalties (Determination)
                </label>
                <DollarsInput
                  className="usa-input usa-input-inline input-medium"
                  id="determination-total-penalties"
                  name="determinationTotalPenalties"
                  value={form.determinationTotalPenalties || ''}
                  onBlur={() => validateAddDeficiencyStatisticsSequence()}
                  onValueChange={values => {
                    updateFormValueSequence({
                      key: 'determinationTotalPenalties',
                      value: values.value,
                    });
                  }}
                />
                <Button
                  link
                  className="padding-0 calculate-penalties"
                  icon="calculator"
                  onClick={() =>
                    showCalculatePenaltiesModalSequence({
                      key: 'determinationTotalPenalties',
                      title: 'Calculate Penalties as determined by Court',
                    })
                  }
                >
                  Calculate penalties as determined by Court
                </Button>
              </FormGroup>
            </div>
          </div>
        </div>
      </>
    );
  },
);
