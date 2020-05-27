import { Button } from '../../ustc-ui/Button/Button';
import { CalculatePenaltiesModal } from '../StartCaseInternal/CalculatePenaltiesModal';
import { CaseDetailHeader } from './CaseDetailHeader';
import { DateInput } from '../../ustc-ui/DateInput/DateInput';
import { DollarsInput } from '../../ustc-ui/DollarsInput/DollarsInput';
import { ErrorNotification } from '../ErrorNotification';
import { FormGroup } from '../../ustc-ui/FormGroup/FormGroup';
import { SuccessNotification } from '../SuccessNotification';
import { connect } from '@cerebral/react';
import { sequences, state } from 'cerebral';
import React from 'react';

export const AddDeficiencyStatistics = connect(
  {
    calculatePenaltiesForAddSequence:
      sequences.calculatePenaltiesForAddSequence,
    form: state.form,
    showCalculatePenaltiesModalSequence:
      sequences.showCalculatePenaltiesModalSequence,
    showModal: state.modal.showModal,
    submitAddDeficiencyStatisticsSequence:
      sequences.submitAddDeficiencyStatisticsSequence,
    updateFormValueSequence: sequences.updateFormValueSequence,
  },
  function StatisticsForm({
    calculatePenaltiesForAddSequence,
    form,
    showCalculatePenaltiesModalSequence,
    showModal,
    submitAddDeficiencyStatisticsSequence,
    updateFormValueSequence,
  }) {
    return (
      <>
        <CaseDetailHeader className="margin-bottom-1" />

        <section className="usa-section grid-container">
          <SuccessNotification />
          <ErrorNotification />

          <h1>Add Deficiency Statistics</h1>

          <div className="blue-container margin-bottom-5">
            <div className="margin-bottom-0">
              <label className="usa-label" htmlFor="name">
                Select Year or period
              </label>

              <FormGroup>
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

              <div className="grid-row grid-gap-4">
                <div className="grid-col-3">
                  {form.yearOrPeriod === 'Year' && (
                    <FormGroup>
                      <label className="usa-label" htmlFor={'year'}>
                        Year
                      </label>
                      <input
                        className="usa-input usa-input-inline year-small"
                        id={'year'}
                        maxLength="4"
                        name={'year'}
                        placeholder="YYYY"
                        value={form.year || ''}
                        // onBlur={() => validatePetitionFromPaperSequence()}
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
                    <FormGroup>
                      <DateInput
                        id={'last-date-of-period'}
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
                        // onBlur={() => validatePetitionFromPaperSequence()}
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
                  <FormGroup>
                    <label
                      className="usa-label"
                      htmlFor={'irs-deficiency-amount'}
                    >
                      Deficiency (IRS Notice)
                    </label>
                    <DollarsInput
                      className="usa-input usa-input-inline input-medium"
                      id={'irs-deficiency-amount'}
                      name={'irsDeficiencyAmount'}
                      value={form.irsDeficiencyAmount || ''}
                      // onBlur={() => validatePetitionFromPaperSequence()}
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
                  <FormGroup>
                    <label
                      className="usa-label"
                      htmlFor={'irs-total-penalties'}
                    >
                      Total penalties (IRS Notice)
                    </label>
                    <DollarsInput
                      className="usa-input usa-input-inline input-medium"
                      id={'irs-deficiency-amount'}
                      name={'irsTotalPenalties'}
                      value={form.irsTotalPenalties || ''}
                      // onBlur={() => validatePetitionFromPaperSequence()}
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
                  <FormGroup>
                    <label
                      className="usa-label"
                      htmlFor={'determination-deficiency-amount'}
                    >
                      Deficiency (Determination)
                    </label>
                    <DollarsInput
                      className="usa-input usa-input-inline input-medium"
                      id={'determination-deficiency-amount'}
                      name={'determinationDeficiencyAmount'}
                      value={form.determinationDeficiencyAmount || ''}
                      // onBlur={() => validatePetitionFromPaperSequence()}
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
                  <FormGroup>
                    <label
                      className="usa-label"
                      htmlFor={'deficiency-total-penalties'}
                    >
                      Total penalties (Determination)
                    </label>
                    <DollarsInput
                      className="usa-input usa-input-inline input-medium"
                      id={'deficiency-total-penalties'}
                      name={'determinationTotalPenalties'}
                      value={form.determinationTotalPenalties || ''}
                      // onBlur={() => validatePetitionFromPaperSequence()}
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
          </div>

          <div className="margin-top-3">
            <Button onClick={() => submitAddDeficiencyStatisticsSequence()}>
              Save
            </Button>

            <Button link onClick={() => {}}>
              Cancel
            </Button>
          </div>
        </section>
        {showModal === 'CalculatePenaltiesModal' && (
          <CalculatePenaltiesModal
            confirmSequenceOverride={() => calculatePenaltiesForAddSequence()}
          />
        )}
      </>
    );
  },
);
